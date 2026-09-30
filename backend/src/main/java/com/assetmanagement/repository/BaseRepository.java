package com.assetmanagement.repository;

import com.assetmanagement.entity.Base;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaseRepository extends JpaRepository<Base, Integer> {
    
}