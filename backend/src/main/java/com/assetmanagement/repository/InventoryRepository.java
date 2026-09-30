package com.assetmanagement.repository;

import com.assetmanagement.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    Optional<Inventory> findByBaseIdAndAssetTypeId(
        Integer baseId,
        Integer assetTypeId
    );
}