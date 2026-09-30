package com.assetmanagement.controller;

import com.assetmanagement.entity.Inventory;
import com.assetmanagement.service.InventoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;


    public InventoryController(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }


    // =========================================================
    // GET ALL INVENTORY
    // =========================================================

    @GetMapping
    public List<Inventory> getAllInventory() {

        return inventoryService.getAllInventory();
    }


    // =========================================================
    // GET INVENTORY BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Inventory getInventoryById(
            @PathVariable Integer id) {

        return inventoryService.getInventoryById(id);
    }


    // =========================================================
    // CREATE INVENTORY
    // =========================================================

    @PostMapping
    public Inventory createInventory(
            @RequestBody Inventory inventory) {

        return inventoryService.createInventory(
            inventory
        );
    }


    // =========================================================
    // UPDATE INVENTORY
    // =========================================================

    @PutMapping("/{id}")
    public Inventory updateInventory(
            @PathVariable Integer id,
            @RequestBody Inventory inventory) {

        return inventoryService.updateInventory(
            id,
            inventory
        );
    }


    // =========================================================
    // DELETE INVENTORY
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteInventory(
            @PathVariable Integer id) {

        inventoryService.deleteInventory(id);

        return "Inventory deleted successfully.";
    }
}