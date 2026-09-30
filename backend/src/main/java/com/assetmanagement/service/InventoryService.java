package com.assetmanagement.service;

import com.assetmanagement.entity.Inventory;
import com.assetmanagement.repository.InventoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final RbacService rbacService;


    public InventoryService(
            InventoryRepository inventoryRepository,
            RbacService rbacService) {

        this.inventoryRepository = inventoryRepository;
        this.rbacService = rbacService;
    }


    // =========================================================
    // GET ALL INVENTORY
    //
    // ADMIN             -> ALL
    // LOGISTICS OFFICER -> ALL BASES
    // BASE COMMANDER    -> OWN BASE ONLY
    // =========================================================

    public List<Inventory> getAllInventory() {

        List<Inventory> inventory =
            inventoryRepository.findAll();


        // ADMIN can see everything
        if (rbacService.isAdmin()) {
            return inventory;
        }


        // LOGISTICS OFFICER can see everything
        if (rbacService.isLogisticsOfficer()) {
            return inventory;
        }


        // BASE COMMANDER can see only own base
        if (rbacService.isBaseCommander()) {

            Integer baseId =
                rbacService.getCurrentUser()
                    .getBaseId();


            if (baseId == null) {

                throw new RuntimeException(
                    "Base Commander is not assigned to any base."
                );
            }


            return inventory.stream()
                .filter(item ->
                    item.getBaseId().equals(baseId)
                )
                .toList();
        }


        throw new RuntimeException(
            "You are not authorized to view inventory."
        );
    }


    // =========================================================
    // GET INVENTORY BY ID
    // =========================================================

    public Inventory getInventoryById(Integer id) {

        Inventory inventory =
            inventoryRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Inventory not found with this id: "
                    + id
                )
            );


        // Check base access
        rbacService.requireBaseAccess(
            inventory.getBaseId()
        );


        return inventory;
    }


    // =========================================================
    // CREATE INVENTORY
    //
    // ADMIN ONLY
    //
    // Normal inventory changes should happen through:
    // Purchase
    // Transfer
    // Assignment
    // Expenditure
    // =========================================================

    public Inventory createInventory(
            Inventory inventory) {

        rbacService.requireAdmin();


        return inventoryRepository.save(
            inventory
        );
    }


    // =========================================================
    // UPDATE INVENTORY
    //
    // ADMIN ONLY
    // =========================================================

    public Inventory updateInventory(
            Integer id,
            Inventory updatedInventory) {

        rbacService.requireAdmin();


        Inventory existingInventory =
            inventoryRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Inventory not found with this id: "
                    + id
                )
            );


        existingInventory.setBaseId(
            updatedInventory.getBaseId()
        );


        existingInventory.setAssetTypeId(
            updatedInventory.getAssetTypeId()
        );


        existingInventory.setQuantity(
            updatedInventory.getQuantity()
        );


        return inventoryRepository.save(
            existingInventory
        );
    }


    // =========================================================
    // DELETE INVENTORY
    //
    // ADMIN ONLY
    // =========================================================

    public void deleteInventory(Integer id) {

        rbacService.requireAdmin();


        Inventory existingInventory =
            inventoryRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Inventory not found with this id: "
                    + id
                )
            );


        inventoryRepository.delete(
            existingInventory
        );
    }
}