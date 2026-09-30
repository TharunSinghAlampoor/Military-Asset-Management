package com.assetmanagement.repository;

import com.assetmanagement.entity.Expenditure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenditureRepository extends JpaRepository<Expenditure, Integer> {
}