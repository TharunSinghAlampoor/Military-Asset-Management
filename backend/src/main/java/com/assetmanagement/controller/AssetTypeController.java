package com.assetmanagement.controller;

import com.assetmanagement.entity.AssetType;
import com.assetmanagement.service.AssetTypeService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/asset-types")
public class AssetTypeController {

    private final AssetTypeService assetTypeService;

    public AssetTypeController(
            AssetTypeService assetTypeService) {

        this.assetTypeService = assetTypeService;
    }

    // =========================================================
    // GET ALL ASSET TYPES
    // ADMIN + BASE COMMANDER + LOGISTICS OFFICER
    // =========================================================

    @GetMapping
    public List<AssetType> getAllAssetTypes() {

        return assetTypeService.getAllAssetTypes();
    }

    // =========================================================
    // GET ASSET TYPE BY ID
    // ADMIN + BASE COMMANDER + LOGISTICS OFFICER
    // =========================================================

    @GetMapping("/{id}")
    public AssetType getAssetTypeById(
            @PathVariable Integer id) {

        return assetTypeService.getAssetTypeById(id);
    }

    // =========================================================
    // CREATE ASSET TYPE
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    public AssetType createAssetType(
            @RequestBody AssetType assetType) {

        return assetTypeService.createAssetType(assetType);
    }

    // =========================================================
    // UPDATE ASSET TYPE
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{id}")
    public AssetType updateAssetType(
            @PathVariable Integer id,
            @RequestBody AssetType assetType) {

        return assetTypeService.updateAssetType(
            id,
            assetType
        );
    }

    // =========================================================
    // DELETE ASSET TYPE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteAssetType(
            @PathVariable Integer id) {

        assetTypeService.deleteAssetType(id);

        return "Asset Type deleted successfully.";
    }
}