package com.assetmanagement.controller;

import com.assetmanagement.entity.Purchase;
import com.assetmanagement.service.PurchaseService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;


    public PurchaseController(
            PurchaseService purchaseService) {

        this.purchaseService = purchaseService;
    }


    // =========================================================
    // GET ALL PURCHASES
    // =========================================================

    @GetMapping
    public List<Purchase> getAllPurchases() {

        return purchaseService.getAllPurchases();
    }


    // =========================================================
    // GET PURCHASE BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Purchase getPurchaseById(
            @PathVariable Integer id) {

        return purchaseService.getPurchaseById(id);
    }


    // =========================================================
    // CREATE PURCHASE
    // =========================================================

    @PostMapping
    public Purchase createPurchase(
            @RequestBody Purchase purchase) {

        return purchaseService.createPurchase(
            purchase
        );
    }


    // =========================================================
    // UPDATE PURCHASE
    // =========================================================

    @PutMapping("/{id}")
    public Purchase updatePurchase(
            @PathVariable Integer id,
            @RequestBody Purchase purchase) {

        return purchaseService.updatePurchase(
            id,
            purchase
        );
    }


    // =========================================================
    // DELETE PURCHASE
    // =========================================================

    @DeleteMapping("/{id}")
    public String deletePurchase(
            @PathVariable Integer id) {

        purchaseService.deletePurchase(id);

        return "Purchase deleted successfully.";
    }
}