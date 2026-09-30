package com.assetmanagement.service;

import com.assetmanagement.entity.Expenditure;
import com.assetmanagement.entity.Inventory;

import com.assetmanagement.repository.ExpenditureRepository;
import com.assetmanagement.repository.InventoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final AuditLogService auditLogService;
    private final InventoryRepository inventoryRepository;
    private final RbacService rbacService;


    public ExpenditureService(
            ExpenditureRepository expenditureRepository,
            AuditLogService auditLogService,
            InventoryRepository inventoryRepository,
            RbacService rbacService) {

        this.expenditureRepository = expenditureRepository;
        this.auditLogService = auditLogService;
        this.inventoryRepository = inventoryRepository;
        this.rbacService = rbacService;
    }


    // =========================================================
    // GET ALL EXPENDITURES
    // =========================================================

    public List<Expenditure> getAllExpenditures() {

        List<Expenditure> expenditures =
                expenditureRepository.findAll();


        // ADMIN -> ALL EXPENDITURES
        if (rbacService.isAdmin()) {
            return expenditures;
        }


        // LOGISTICS OFFICER -> ALL
        if (rbacService.isLogisticsOfficer()) {
            return expenditures;
        }


        // BASE COMMANDER -> OWN BASE ONLY
        if (rbacService.isBaseCommander()) {

            Integer baseId =
                    rbacService.getCurrentUser().getBaseId();


            if (baseId == null) {

                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }


            return expenditures.stream()
                    .filter(expenditure ->
                            expenditure.getBaseId() != null
                                    && expenditure.getBaseId().equals(baseId)
                    )
                    .toList();
        }


        throw new RuntimeException(
                "You are not authorized to view expenditures."
        );
    }


    // =========================================================
    // GET EXPENDITURE BY ID
    // =========================================================

    public Expenditure getExpenditureById(Integer id) {

        Expenditure expenditure =
                expenditureRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Expenditure not found with id : "
                                                + id
                                )
                        );


        rbacService.requireBaseAccess(
                expenditure.getBaseId()
        );


        return expenditure;
    }


    // =========================================================
    // CREATE EXPENDITURE
    // =========================================================

    @Transactional
    public Expenditure createExpenditure(
            Expenditure expenditure) {


        // -----------------------------------------------------
        // VALIDATE BASIC VALUES
        // -----------------------------------------------------

        if (expenditure.getBaseId() == null) {

            throw new RuntimeException(
                    "Base ID is required."
            );
        }


        if (expenditure.getAssetTypeId() == null) {

            throw new RuntimeException(
                    "Asset Type ID is required."
            );
        }


        if (expenditure.getQuantity() == null
                || expenditure.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than 0."
            );
        }


        if (expenditure.getExpendedDate() == null) {

            throw new RuntimeException(
                    "Expended date is required."
            );
        }


        // -----------------------------------------------------
        // CHECK USER ACCESS
        // -----------------------------------------------------

        rbacService.requireBaseAccess(
                expenditure.getBaseId()
        );


        // -----------------------------------------------------
        // FIND INVENTORY
        // -----------------------------------------------------

        Inventory inventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                expenditure.getBaseId(),
                                expenditure.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Inventory record not found for this base and asset type."
                                )
                        );


        // -----------------------------------------------------
        // CHECK AVAILABLE QUANTITY
        // -----------------------------------------------------

        if (inventory.getQuantity() == null) {

            inventory.setQuantity(0);
        }


        if (inventory.getQuantity()
                < expenditure.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient inventory. Available quantity: "
                            + inventory.getQuantity()
                            + ", requested quantity: "
                            + expenditure.getQuantity()
            );
        }


        // -----------------------------------------------------
        // REDUCE INVENTORY
        // -----------------------------------------------------

        inventory.setQuantity(
                inventory.getQuantity()
                        - expenditure.getQuantity()
        );


        inventoryRepository.save(inventory);


        // -----------------------------------------------------
        // SET CREATED BY
        // -----------------------------------------------------

        expenditure.setCreatedBy(
                rbacService.getCurrentUser().getId()
        );


        // -----------------------------------------------------
        // SAVE EXPENDITURE
        // -----------------------------------------------------

        Expenditure savedExpenditure =
                expenditureRepository.save(
                        expenditure
                );


        // -----------------------------------------------------
        // AUDIT LOG
        // -----------------------------------------------------

        auditLogService.logAction(
                null,
                "CREATE",
                "EXPENDITURE",
                savedExpenditure.getId(),
                "Created expenditure with quantity : "
                        + savedExpenditure.getQuantity()
        );


        return savedExpenditure;
    }


    // =========================================================
    // UPDATE EXPENDITURE
    // =========================================================

    @Transactional
    public Expenditure updateExpenditure(
            Integer id,
            Expenditure updatedExpenditure) {


        // -----------------------------------------------------
        // FIND EXISTING EXPENDITURE
        // -----------------------------------------------------

        Expenditure existingExpenditure =
                expenditureRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Expenditure not found with id : "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // VALIDATE NEW VALUES
        // -----------------------------------------------------

        if (updatedExpenditure.getBaseId() == null) {

            throw new RuntimeException(
                    "Base ID is required."
            );
        }


        if (updatedExpenditure.getAssetTypeId() == null) {

            throw new RuntimeException(
                    "Asset Type ID is required."
            );
        }


        if (updatedExpenditure.getQuantity() == null
                || updatedExpenditure.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than 0."
            );
        }


        if (updatedExpenditure.getExpendedDate() == null) {

            throw new RuntimeException(
                    "Expended date is required."
            );
        }


        // -----------------------------------------------------
        // CHECK ACCESS TO OLD BASE
        // -----------------------------------------------------

        rbacService.requireBaseAccess(
                existingExpenditure.getBaseId()
        );


        // -----------------------------------------------------
        // CHECK ACCESS TO NEW BASE
        // -----------------------------------------------------

        rbacService.requireBaseAccess(
                updatedExpenditure.getBaseId()
        );


        // -----------------------------------------------------
        // OLD INVENTORY
        // -----------------------------------------------------

        Inventory oldInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingExpenditure.getBaseId(),
                                existingExpenditure.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Old inventory record not found."
                                )
                        );


        // -----------------------------------------------------
        // NEW INVENTORY
        // -----------------------------------------------------

        Inventory newInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                updatedExpenditure.getBaseId(),
                                updatedExpenditure.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "New inventory record not found."
                                )
                        );


        // =====================================================
        // CASE 1
        // SAME BASE + SAME ASSET TYPE
        // =====================================================

        if (
                existingExpenditure.getBaseId()
                        .equals(updatedExpenditure.getBaseId())

                &&

                existingExpenditure.getAssetTypeId()
                        .equals(updatedExpenditure.getAssetTypeId())
        ) {

            int oldQuantity =
                    existingExpenditure.getQuantity();

            int newQuantity =
                    updatedExpenditure.getQuantity();


            int difference =
                    newQuantity - oldQuantity;


            // -------------------------------------------------
            // QUANTITY INCREASE
            // -------------------------------------------------

            if (difference > 0) {

                if (newInventory.getQuantity()
                        < difference) {

                    throw new RuntimeException(
                            "Insufficient inventory. Additional quantity available: "
                                    + newInventory.getQuantity()
                                    + ", additional quantity required: "
                                    + difference
                    );
                }


                newInventory.setQuantity(
                        newInventory.getQuantity()
                                - difference
                );
            }


            // -------------------------------------------------
            // QUANTITY DECREASE
            // -------------------------------------------------

            else if (difference < 0) {

                newInventory.setQuantity(
                        newInventory.getQuantity()
                                + Math.abs(difference)
                );
            }


            inventoryRepository.save(
                    newInventory
            );
        }


        // =====================================================
        // CASE 2
        // BASE OR ASSET TYPE CHANGED
        // =====================================================

        else {

            // -------------------------------------------------
            // RESTORE OLD INVENTORY
            // -------------------------------------------------

            oldInventory.setQuantity(
                    oldInventory.getQuantity()
                            + existingExpenditure.getQuantity()
            );


            inventoryRepository.save(
                    oldInventory
            );


            // -------------------------------------------------
            // CHECK NEW INVENTORY
            // -------------------------------------------------

            if (newInventory.getQuantity()
                    < updatedExpenditure.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient inventory in the new base/asset type."
                );
            }


            // -------------------------------------------------
            // REDUCE NEW INVENTORY
            // -------------------------------------------------

            newInventory.setQuantity(
                    newInventory.getQuantity()
                            - updatedExpenditure.getQuantity()
            );


            inventoryRepository.save(
                    newInventory
            );
        }


        // =====================================================
        // UPDATE EXPENDITURE DATA
        // =====================================================

        existingExpenditure.setBaseId(
                updatedExpenditure.getBaseId()
        );


        existingExpenditure.setAssetTypeId(
                updatedExpenditure.getAssetTypeId()
        );


        existingExpenditure.setQuantity(
                updatedExpenditure.getQuantity()
        );


        existingExpenditure.setReason(
                updatedExpenditure.getReason()
        );


        existingExpenditure.setExpendedDate(
                updatedExpenditure.getExpendedDate()
        );


        // -----------------------------------------------------
        // KEEP ORIGINAL CREATED BY
        // -----------------------------------------------------

        Expenditure savedExpenditure =
                expenditureRepository.save(
                        existingExpenditure
                );


        // -----------------------------------------------------
        // AUDIT LOG
        // -----------------------------------------------------

        auditLogService.logAction(
                null,
                "UPDATE",
                "EXPENDITURE",
                savedExpenditure.getId(),
                "Updated expenditure with quantity : "
                        + savedExpenditure.getQuantity()
        );


        return savedExpenditure;
    }


    // =========================================================
    // DELETE EXPENDITURE
    // =========================================================

    @Transactional
    public void deleteExpenditure(Integer id) {


        // -----------------------------------------------------
        // FIND EXPENDITURE
        // -----------------------------------------------------

        Expenditure existingExpenditure =
                expenditureRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Expenditure not found with id : "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // CHECK ACCESS
        // -----------------------------------------------------

        rbacService.requireBaseAccess(
                existingExpenditure.getBaseId()
        );


        // -----------------------------------------------------
        // FIND INVENTORY
        // -----------------------------------------------------

        Inventory inventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingExpenditure.getBaseId(),
                                existingExpenditure.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Inventory record not found."
                                )
                        );


        // -----------------------------------------------------
        // RESTORE INVENTORY
        // -----------------------------------------------------

        inventory.setQuantity(
                inventory.getQuantity()
                        + existingExpenditure.getQuantity()
        );


        inventoryRepository.save(
                inventory
        );


        // -----------------------------------------------------
        // AUDIT LOG
        // -----------------------------------------------------

        auditLogService.logAction(
                null,
                "DELETE",
                "EXPENDITURE",
                existingExpenditure.getId(),
                "Deleted expenditure"
        );


        // -----------------------------------------------------
        // DELETE EXPENDITURE
        // -----------------------------------------------------

        expenditureRepository.delete(
                existingExpenditure
        );
    }
}