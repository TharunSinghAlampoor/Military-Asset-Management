package com.assetmanagement.service;

import com.assetmanagement.entity.Transfer;
import com.assetmanagement.entity.Inventory;

import com.assetmanagement.repository.TransferRepository;
import com.assetmanagement.repository.InventoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransferService {

    private final TransferRepository transferRepository;
    private final AuditLogService auditLogService;
    private final InventoryRepository inventoryRepository;
    private final RbacService rbacService;

    public TransferService(
            TransferRepository transferRepository,
            AuditLogService auditLogService,
            InventoryRepository inventoryRepository,
            RbacService rbacService) {

        this.transferRepository = transferRepository;
        this.auditLogService = auditLogService;
        this.inventoryRepository = inventoryRepository;
        this.rbacService = rbacService;
    }

    // =========================================================
    // GET ALL TRANSFERS
    // =========================================================

    public List<Transfer> getAllTransfers() {

        List<Transfer> transfers =
                transferRepository.findAll();

        // ADMIN -> all transfers
        if (rbacService.isAdmin()) {
            return transfers;
        }

        // LOGISTICS OFFICER -> all transfers
        if (rbacService.isLogisticsOfficer()) {
            return transfers;
        }

        // BASE COMMANDER -> transfers from their own base
        if (rbacService.isBaseCommander()) {

            Integer baseId =
                    rbacService.getCurrentUser().getBaseId();

            if (baseId == null) {
                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }

            return transfers.stream()
                    .filter(transfer ->
                            transfer.getFromBaseId().equals(baseId)
                    )
                    .toList();
        }

        throw new RuntimeException(
                "You are not authorized to view transfers."
        );
    }

    // =========================================================
    // GET TRANSFER BY ID
    // =========================================================

    public Transfer getTransferById(Integer id) {

        Transfer transfer =
                transferRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transfer not found with this id : "
                                                + id
                                )
                        );

        rbacService.requireTransferAccess(
                transfer.getFromBaseId(),
                transfer.getToBaseId()
        );

        return transfer;
    }

    // =========================================================
    // CREATE TRANSFER
    // =========================================================

    @Transactional
    public Transfer createTransfer(
            Transfer transfer) {

        // =====================================================
        // CHECK RBAC
        // =====================================================

        rbacService.requireTransferAccess(
                transfer.getFromBaseId(),
                transfer.getToBaseId()
        );

        // =====================================================
        // VALIDATE BASES
        // =====================================================

        if (transfer.getFromBaseId() == null ||
                transfer.getToBaseId() == null) {

            throw new RuntimeException(
                    "From Base and To Base are required."
            );
        }

        if (transfer.getFromBaseId()
                .equals(transfer.getToBaseId())) {

            throw new RuntimeException(
                    "Source base and destination base cannot be the same."
            );
        }

        // =====================================================
        // VALIDATE ASSET TYPE
        // =====================================================

        if (transfer.getAssetTypeId() == null) {

            throw new RuntimeException(
                    "Asset Type is required."
            );
        }

        // =====================================================
        // VALIDATE QUANTITY
        // =====================================================

        if (transfer.getQuantity() == null ||
                transfer.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Transfer quantity must be greater than zero."
            );
        }

        // =====================================================
        // VALIDATE DATE
        // =====================================================

        if (transfer.getTransferDate() == null) {

            throw new RuntimeException(
                    "Transfer date is required."
            );
        }

        // =====================================================
        // FIND SOURCE INVENTORY
        // =====================================================

        Inventory sourceInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                transfer.getFromBaseId(),
                                transfer.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Source inventory not found for this base and asset type."
                                )
                        );

        // =====================================================
        // CHECK SOURCE QUANTITY
        // =====================================================

        if (sourceInventory.getQuantity()
                < transfer.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient inventory in source base."
            );
        }

        // =====================================================
        // FIND OR CREATE DESTINATION INVENTORY
        // =====================================================

        Inventory destinationInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                transfer.getToBaseId(),
                                transfer.getAssetTypeId()
                        )
                        .orElse(null);

        // =====================================================
        // CREATE DESTINATION INVENTORY IF NOT FOUND
        // =====================================================

        if (destinationInventory == null) {

            destinationInventory = new Inventory();

            destinationInventory.setBaseId(
                    transfer.getToBaseId()
            );

            destinationInventory.setAssetTypeId(
                    transfer.getAssetTypeId()
            );

            destinationInventory.setQuantity(0);
        }

        // =====================================================
        // DECREASE SOURCE INVENTORY
        // =====================================================

        sourceInventory.setQuantity(
                sourceInventory.getQuantity()
                        - transfer.getQuantity()
        );

        inventoryRepository.save(
                sourceInventory
        );

        // =====================================================
        // INCREASE DESTINATION INVENTORY
        // =====================================================

        destinationInventory.setQuantity(
                destinationInventory.getQuantity()
                        + transfer.getQuantity()
        );

        inventoryRepository.save(
                destinationInventory
        );

        // =====================================================
        // STORE CURRENT USER
        // =====================================================

        transfer.setCreatedBy(
                rbacService.getCurrentUser().getId()
        );

        // =====================================================
        // SAVE TRANSFER
        // =====================================================

        Transfer savedTransfer =
                transferRepository.save(
                        transfer
                );

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.logAction(
                null,
                "CREATE",
                "TRANSFER",
                savedTransfer.getId(),
                "Created transfer with quantity : "
                        + savedTransfer.getQuantity()
        );

        return savedTransfer;
    }

    // =========================================================
    // UPDATE TRANSFER
    // =========================================================

    @Transactional
    public Transfer updateTransfer(
            Integer id,
            Transfer updatedTransfer) {

        // =====================================================
        // FIND EXISTING TRANSFER
        // =====================================================

        Transfer existingTransfer =
                transferRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transfer not found with this id : "
                                                + id
                                )
                        );

        // =====================================================
        // CHECK OLD TRANSFER ACCESS
        // =====================================================

        rbacService.requireTransferAccess(
                existingTransfer.getFromBaseId(),
                existingTransfer.getToBaseId()
        );

        // =====================================================
        // CHECK NEW TRANSFER ACCESS
        // =====================================================

        rbacService.requireTransferAccess(
                updatedTransfer.getFromBaseId(),
                updatedTransfer.getToBaseId()
        );

        // =====================================================
        // VALIDATION
        // =====================================================

        if (updatedTransfer.getFromBaseId() == null ||
                updatedTransfer.getToBaseId() == null) {

            throw new RuntimeException(
                    "From Base and To Base are required."
            );
        }

        if (updatedTransfer.getFromBaseId()
                .equals(updatedTransfer.getToBaseId())) {

            throw new RuntimeException(
                    "Source base and destination base cannot be the same."
            );
        }

        if (updatedTransfer.getAssetTypeId() == null) {

            throw new RuntimeException(
                    "Asset Type is required."
            );
        }

        if (updatedTransfer.getQuantity() == null ||
                updatedTransfer.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Transfer quantity must be greater than zero."
            );
        }

        if (updatedTransfer.getTransferDate() == null) {

            throw new RuntimeException(
                    "Transfer date is required."
            );
        }

        // =====================================================
        // RESTORE OLD TRANSFER
        // =====================================================

        Inventory oldSourceInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingTransfer.getFromBaseId(),
                                existingTransfer.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Old source inventory not found."
                                )
                        );

        Inventory oldDestinationInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingTransfer.getToBaseId(),
                                existingTransfer.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Old destination inventory not found."
                                )
                        );

        // =====================================================
        // CHECK OLD DESTINATION
        // =====================================================

        if (oldDestinationInventory.getQuantity()
                < existingTransfer.getQuantity()) {

            throw new RuntimeException(
                    "Cannot update transfer because old destination inventory is insufficient."
            );
        }

        // =====================================================
        // RETURN OLD QUANTITY TO SOURCE
        // =====================================================

        oldSourceInventory.setQuantity(
                oldSourceInventory.getQuantity()
                        + existingTransfer.getQuantity()
        );

        // =====================================================
        // REMOVE OLD QUANTITY FROM DESTINATION
        // =====================================================

        oldDestinationInventory.setQuantity(
                oldDestinationInventory.getQuantity()
                        - existingTransfer.getQuantity()
        );

        inventoryRepository.save(
                oldSourceInventory
        );

        inventoryRepository.save(
                oldDestinationInventory
        );

        // =====================================================
        // FIND NEW SOURCE INVENTORY
        // =====================================================

        Inventory newSourceInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                updatedTransfer.getFromBaseId(),
                                updatedTransfer.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "New source inventory not found."
                                )
                        );

        // =====================================================
        // FIND OR CREATE NEW DESTINATION INVENTORY
        // =====================================================

        Inventory newDestinationInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                updatedTransfer.getToBaseId(),
                                updatedTransfer.getAssetTypeId()
                        )
                        .orElse(null);

        if (newDestinationInventory == null) {

            newDestinationInventory = new Inventory();

            newDestinationInventory.setBaseId(
                    updatedTransfer.getToBaseId()
            );

            newDestinationInventory.setAssetTypeId(
                    updatedTransfer.getAssetTypeId()
            );

            newDestinationInventory.setQuantity(0);
        }

        // =====================================================
        // CHECK NEW SOURCE QUANTITY
        // =====================================================

        if (newSourceInventory.getQuantity()
                < updatedTransfer.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient inventory in new source base."
            );
        }

        // =====================================================
        // DECREASE NEW SOURCE
        // =====================================================

        newSourceInventory.setQuantity(
                newSourceInventory.getQuantity()
                        - updatedTransfer.getQuantity()
        );

        // =====================================================
        // INCREASE NEW DESTINATION
        // =====================================================

        newDestinationInventory.setQuantity(
                newDestinationInventory.getQuantity()
                        + updatedTransfer.getQuantity()
        );

        inventoryRepository.save(
                newSourceInventory
        );

        inventoryRepository.save(
                newDestinationInventory
        );

        // =====================================================
        // UPDATE TRANSFER RECORD
        // =====================================================

        existingTransfer.setFromBaseId(
                updatedTransfer.getFromBaseId()
        );

        existingTransfer.setToBaseId(
                updatedTransfer.getToBaseId()
        );

        existingTransfer.setAssetTypeId(
                updatedTransfer.getAssetTypeId()
        );

        existingTransfer.setQuantity(
                updatedTransfer.getQuantity()
        );

        existingTransfer.setTransferDate(
                updatedTransfer.getTransferDate()
        );

        existingTransfer.setStatus(
                updatedTransfer.getStatus()
        );

        // =====================================================
        // SAVE UPDATED TRANSFER
        // =====================================================

        Transfer savedTransfer =
                transferRepository.save(
                        existingTransfer
                );

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.logAction(
                null,
                "UPDATE",
                "TRANSFER",
                savedTransfer.getId(),
                "Updated transfer with quantity : "
                        + savedTransfer.getQuantity()
        );

        return savedTransfer;
    }

    // =========================================================
    // DELETE TRANSFER
    // =========================================================

    @Transactional
    public void deleteTransfer(Integer id) {

        // =====================================================
        // FIND TRANSFER
        // =====================================================

        Transfer existingTransfer =
                transferRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transfer not found with this id : "
                                                + id
                                )
                        );

        // =====================================================
        // CHECK RBAC
        // =====================================================

        rbacService.requireTransferAccess(
                existingTransfer.getFromBaseId(),
                existingTransfer.getToBaseId()
        );

        // =====================================================
        // FIND SOURCE INVENTORY
        // =====================================================

        Inventory sourceInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingTransfer.getFromBaseId(),
                                existingTransfer.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Source inventory not found."
                                )
                        );

        // =====================================================
        // FIND DESTINATION INVENTORY
        // =====================================================

        Inventory destinationInventory =
                inventoryRepository
                        .findByBaseIdAndAssetTypeId(
                                existingTransfer.getToBaseId(),
                                existingTransfer.getAssetTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Destination inventory not found."
                                )
                        );

        // =====================================================
        // CHECK DESTINATION QUANTITY
        // =====================================================

        if (destinationInventory.getQuantity()
                < existingTransfer.getQuantity()) {

            throw new RuntimeException(
                    "Cannot delete transfer because destination inventory is insufficient."
            );
        }

        // =====================================================
        // RESTORE SOURCE
        // =====================================================

        sourceInventory.setQuantity(
                sourceInventory.getQuantity()
                        + existingTransfer.getQuantity()
        );

        // =====================================================
        // REMOVE FROM DESTINATION
        // =====================================================

        destinationInventory.setQuantity(
                destinationInventory.getQuantity()
                        - existingTransfer.getQuantity()
        );

        inventoryRepository.save(
                sourceInventory
        );

        inventoryRepository.save(
                destinationInventory
        );

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.logAction(
                null,
                "DELETE",
                "TRANSFER",
                existingTransfer.getId(),
                "Deleted transfer"
        );

        // =====================================================
        // DELETE TRANSFER
        // =====================================================

        transferRepository.delete(
                existingTransfer
        );
    }
}