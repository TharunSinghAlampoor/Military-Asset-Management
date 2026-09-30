package com.assetmanagement.service;

import com.assetmanagement.entity.AssetType;
import com.assetmanagement.repository.AssetTypeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetTypeService {

    private final AssetTypeRepository assetTypeRepository;

    private final AuditLogService auditLogService;

    private final RbacService rbacService;


    public AssetTypeService(
            AssetTypeRepository assetTypeRepository,
            AuditLogService auditLogService,
            RbacService rbacService) {

        this.assetTypeRepository =
            assetTypeRepository;

        this.auditLogService =
            auditLogService;

        this.rbacService =
            rbacService;
    }


    // =========================================================
    // GET ALL ASSET TYPES
    //
    // ADMIN             -> allowed
    // BASE COMMANDER    -> allowed
    // LOGISTICS OFFICER -> allowed
    // =========================================================

    public List<AssetType> getAllAssetTypes() {

        return assetTypeRepository.findAll();
    }


    // =========================================================
    // GET ASSET TYPE BY ID
    //
    // ADMIN             -> allowed
    // BASE COMMANDER    -> allowed
    // LOGISTICS OFFICER -> allowed
    // =========================================================

    public AssetType getAssetTypeById(Integer id) {

        return assetTypeRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Asset Type not found with this id: "
                    + id
                )
            );
    }


    // =========================================================
    // CREATE ASSET TYPE
    //
    // ADMIN             -> allowed
    // BASE COMMANDER    -> NOT allowed
    // LOGISTICS OFFICER -> NOT allowed
    // =========================================================

    public AssetType createAssetType(
            AssetType assetType) {


        // Only ADMIN can create asset types
        rbacService.requireAdmin();


        AssetType savedAssetType =
            assetTypeRepository.save(assetType);


        // Create audit log
        auditLogService.logAction(
            null,
            "CREATE",
            "ASSET_TYPE",
            savedAssetType.getId(),
            "Created asset type: "
            + savedAssetType.getName()
        );


        return savedAssetType;
    }


    // =========================================================
    // UPDATE ASSET TYPE
    //
    // ADMIN             -> allowed
    // BASE COMMANDER    -> NOT allowed
    // LOGISTICS OFFICER -> NOT allowed
    // =========================================================

    public AssetType updateAssetType(
            Integer id,
            AssetType updatedAssetType) {


        // ADMIN or BASE COMMANDER can update asset types
        rbacService.requireAdminOrBaseCommander();


        AssetType existingAssetType =
            assetTypeRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Asset Type not found with this id: "
                    + id
                )
            );


        existingAssetType.setName(
            updatedAssetType.getName()
        );


        existingAssetType.setCategory(
            updatedAssetType.getCategory()
        );


        AssetType savedAssetType =
            assetTypeRepository.save(
                existingAssetType
            );


        // Create audit log
        auditLogService.logAction(
            null,
            "UPDATE",
            "ASSET_TYPE",
            savedAssetType.getId(),
            "Updated asset type: "
            + savedAssetType.getName()
        );


        return savedAssetType;
    }


    // =========================================================
    // DELETE ASSET TYPE
    //
    // ADMIN             -> allowed
    // BASE COMMANDER    -> NOT allowed
    // LOGISTICS OFFICER -> NOT allowed
    // =========================================================

    public void deleteAssetType(Integer id) {


        // ADMIN or BASE COMMANDER can delete asset types
        rbacService.requireAdminOrBaseCommander();


        AssetType existingAssetType =
            assetTypeRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Asset Type not found with this id: "
                    + id
                )
            );


        // Create audit log before deleting
        auditLogService.logAction(
            null,
            "DELETE",
            "ASSET_TYPE",
            existingAssetType.getId(),
            "Deleted asset type: "
            + existingAssetType.getName()
        );


        assetTypeRepository.delete(
            existingAssetType
        );
    }
}