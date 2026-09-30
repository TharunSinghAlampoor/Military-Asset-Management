package com.assetmanagement.repository;

import com.assetmanagement.entity.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetTypeRepository extends JpaRepository<AssetType, Integer> {
    
}