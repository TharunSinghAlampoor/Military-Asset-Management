package com.assetmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenditures")
public class Expenditure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "base_id", nullable = false)
    private Integer baseId;

    @Column(name = "asset_type_id", nullable = false)
    private Integer assetTypeId;

    @Column(nullable = false)
    private Integer quantity;

    private String reason;

    @Column(name = "expended_date", nullable = false)
    private LocalDate expendedDate;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    public Expenditure() {
    }
    
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getBaseId() {
        return baseId;
    }

    public void setBaseId(Integer baseId) {
        this.baseId = baseId;
    }

    public Integer getAssetTypeId() {
        return assetTypeId;
    }

    public void setAssetTypeId(Integer assetTypeId) {
        this.assetTypeId = assetTypeId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getExpendedDate() {
        return expendedDate;
    }

    public void setExpendedDate(LocalDate expendedDate) {
        this.expendedDate = expendedDate;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }
}