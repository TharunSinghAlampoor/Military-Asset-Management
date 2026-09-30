package com.assetmanagement.service;

import com.assetmanagement.entity.Inventory;
import com.assetmanagement.entity.Purchase;
import com.assetmanagement.entity.User;
import com.assetmanagement.repository.PurchaseRepository;
import com.assetmanagement.repository.UserRepository;
import com.assetmanagement.repository.InventoryRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            AuditLogService auditLogService,
            UserRepository userRepository,
            InventoryRepository inventoryRepository) {

        this.purchaseRepository = purchaseRepository;
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
    }

    // =========================================================
    // GET ALL PURCHASES
    // =========================================================

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    // =========================================================
    // GET PURCHASE BY ID
    // =========================================================

    public Purchase getPurchaseById(Integer id) {

        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Purchase not found with this id : " + id
                ));
    }

    // =========================================================
    // CREATE PURCHASE
    // =========================================================

    @Transactional
    public Purchase createPurchase(Purchase purchase) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                authentication.getPrincipal() == null) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        Integer userId;

        try {
            userId = (Integer) authentication.getPrincipal();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Invalid authenticated user."
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Logged-in user is not found."
                ));

        // =====================================================
        // VALIDATE PURCHASE DATA
        // =====================================================

        if (purchase.getBaseId() == null) {
            throw new RuntimeException(
                    "Base ID is required."
            );
        }

        if (purchase.getAssetTypeId() == null) {
            throw new RuntimeException(
                    "Asset Type ID is required."
            );
        }

        if (purchase.getQuantity() == null ||
                purchase.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Purchase quantity must be greater than zero."
            );
        }

        if (purchase.getPurchaseDate() == null) {
            throw new RuntimeException(
                    "Purchase date is required."
            );
        }

        // =====================================================
        // BASE COMMANDER CAN ONLY CREATE FOR OWN BASE
        // =====================================================

        if (user.getRole().name().equals("BASE_COMMANDER")) {

            if (user.getBaseId() == null) {
                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }

            if (!user.getBaseId().equals(purchase.getBaseId())) {
                throw new RuntimeException(
                        "You can only manage purchases for your own base."
                );
            }
        }

        // =====================================================
        // STORE LOGGED-IN USER
        // =====================================================

        purchase.setCreatedBy(userId);

        // =====================================================
        // FIND INVENTORY
        // =====================================================

        Inventory inventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                purchase.getBaseId(),
                                purchase.getAssetTypeId()
                        )
                        .orElse(null);

        // =====================================================
        // CREATE NEW INVENTORY RECORD
        // =====================================================

        if (inventory == null) {

            inventory = new Inventory();

            inventory.setBaseId(
                    purchase.getBaseId()
            );

            inventory.setAssetTypeId(
                    purchase.getAssetTypeId()
            );

            inventory.setQuantity(
                    purchase.getQuantity()
            );

        } else {

            // =================================================
            // INCREASE EXISTING INVENTORY
            // =================================================

            inventory.setQuantity(
                    inventory.getQuantity()
                            + purchase.getQuantity()
            );
        }

        // =====================================================
        // SAVE INVENTORY
        // =====================================================

        inventoryRepository.save(inventory);

        // =====================================================
        // SAVE PURCHASE
        // =====================================================

        Purchase savedPurchase =
                purchaseRepository.save(purchase);

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.logAction(
                userId,
                "CREATE",
                "PURCHASE",
                savedPurchase.getId(),
                "Created purchase with quantity : "
                        + savedPurchase.getQuantity()
        );

        return savedPurchase;
    }

    // =========================================================
    // UPDATE PURCHASE
    // =========================================================

    @Transactional
    public Purchase updatePurchase(
            Integer id,
            Purchase updatedPurchase) {

        // =====================================================
        // FIND EXISTING PURCHASE
        // =====================================================

        Purchase existingPurchase =
                purchaseRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException(
                                "Purchase not found with this id : " + id
                        ));

        // =====================================================
        // GET CURRENT USER
        // =====================================================

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                authentication.getPrincipal() == null) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        Integer userId;

        try {
            userId = (Integer) authentication.getPrincipal();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Invalid authenticated user."
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Logged-in user is not found."
                ));

        // =====================================================
        // VALIDATE UPDATED DATA
        // =====================================================

        if (updatedPurchase.getBaseId() == null) {
            throw new RuntimeException(
                    "Base ID is required."
            );
        }

        if (updatedPurchase.getAssetTypeId() == null) {
            throw new RuntimeException(
                    "Asset Type ID is required."
            );
        }

        if (updatedPurchase.getQuantity() == null ||
                updatedPurchase.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Purchase quantity must be greater than zero."
            );
        }

        if (updatedPurchase.getPurchaseDate() == null) {
            throw new RuntimeException(
                    "Purchase date is required."
            );
        }

        // =====================================================
        // BASE COMMANDER CAN ONLY UPDATE OWN BASE PURCHASE
        // =====================================================

        if (user.getRole().name().equals("BASE_COMMANDER")) {

            if (user.getBaseId() == null) {
                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }

            if (!user.getBaseId()
                    .equals(existingPurchase.getBaseId())) {

                throw new RuntimeException(
                        "You can only update purchases for your own base."
                );
            }

            if (!user.getBaseId()
                    .equals(updatedPurchase.getBaseId())) {

                throw new RuntimeException(
                        "You cannot move purchase to another base."
                );
            }
        }

        // =====================================================
        // KEEP PURCHASE IN SAME BASE
        // =====================================================

        if (!existingPurchase.getBaseId()
                .equals(updatedPurchase.getBaseId())) {

            throw new RuntimeException(
                    "You cannot change the base of an existing purchase."
            );
        }

        // =====================================================
        // KEEP PURCHASE IN SAME ASSET TYPE
        // =====================================================

        if (!existingPurchase.getAssetTypeId()
                .equals(updatedPurchase.getAssetTypeId())) {

            throw new RuntimeException(
                    "You cannot change the asset type of an existing purchase."
            );
        }

        // =====================================================
        // CALCULATE QUANTITY DIFFERENCE
        // =====================================================

        int quantityDifference =
                updatedPurchase.getQuantity()
                        - existingPurchase.getQuantity();

        // =====================================================
        // FIND INVENTORY
        // =====================================================

        Inventory inventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingPurchase.getBaseId(),
                                existingPurchase.getAssetTypeId()
                        )
                        .orElseThrow(() -> new RuntimeException(
                                "Inventory record not found."
                        ));

        // =====================================================
        // CHECK FOR NEGATIVE INVENTORY
        // =====================================================

        if (inventory.getQuantity()
                + quantityDifference < 0) {

            throw new RuntimeException(
                    "Cannot update purchase because inventory would become negative."
            );
        }

        // =====================================================
        // UPDATE INVENTORY
        // =====================================================

        inventory.setQuantity(
                inventory.getQuantity()
                        + quantityDifference
        );

        inventoryRepository.save(inventory);

        // =====================================================
        // UPDATE PURCHASE
        // =====================================================

        existingPurchase.setBaseId(
                updatedPurchase.getBaseId()
        );

        existingPurchase.setAssetTypeId(
                updatedPurchase.getAssetTypeId()
        );

        existingPurchase.setQuantity(
                updatedPurchase.getQuantity()
        );

        existingPurchase.setPurchaseDate(
                updatedPurchase.getPurchaseDate()
        );

        existingPurchase.setReferenceNumber(
                updatedPurchase.getReferenceNumber()
        );

        // =====================================================
        // DO NOT CHANGE CREATED BY
        // =====================================================

        Purchase savedPurchase =
                purchaseRepository.save(existingPurchase);

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.logAction(
                userId,
                "UPDATE",
                "PURCHASE",
                savedPurchase.getId(),
                "Updated purchase quantity : "
                        + savedPurchase.getQuantity()
        );

        return savedPurchase;
    }

    // =========================================================
    // DELETE PURCHASE
    // =========================================================

    @Transactional
    public void deletePurchase(Integer id) {

        // =====================================================
        // FIND PURCHASE
        // =====================================================

        Purchase existingPurchase =
                purchaseRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException(
                                "Purchase not found with this id : " + id
                        ));

        // =====================================================
        // GET CURRENT USER
        // =====================================================

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                authentication.getPrincipal() == null) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        Integer userId;

        try {
            userId = (Integer) authentication.getPrincipal();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Invalid authenticated user."
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Logged-in user is not found."
                ));

        // =====================================================
        // BASE COMMANDER CAN ONLY DELETE OWN BASE PURCHASE
        // =====================================================

        if (user.getRole().name().equals("BASE_COMMANDER")) {

            if (user.getBaseId() == null) {
                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }

            if (!user.getBaseId()
                    .equals(existingPurchase.getBaseId())) {

                throw new RuntimeException(
                        "You can only delete purchases for your own base."
                );
            }
        }

        // =====================================================
        // FIND INVENTORY
        // =====================================================

        Inventory inventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingPurchase.getBaseId(),
                                existingPurchase.getAssetTypeId()
                        )
                        .orElseThrow(() -> new RuntimeException(
                                "Inventory record not found."
                        ));

        // =====================================================
        // CHECK INVENTORY
        // =====================================================

        if (inventory.getQuantity()
                < existingPurchase.getQuantity()) {

            throw new RuntimeException(
                    "Cannot delete purchase because current inventory is insufficient."
            );
        }

        // =====================================================
        // REVERSE PURCHASE EFFECT
        // =====================================================

        inventory.setQuantity(
                inventory.getQuantity()
                        - existingPurchase.getQuantity()
        );

        inventoryRepository.save(inventory);

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.logAction(
                userId,
                "DELETE",
                "PURCHASE",
                existingPurchase.getId(),
                "Deleted purchase with quantity : "
                        + existingPurchase.getQuantity()
        );

        // =====================================================
        // DELETE PURCHASE
        // =====================================================

        purchaseRepository.delete(existingPurchase);
    }
}