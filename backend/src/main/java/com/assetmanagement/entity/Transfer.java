package com.assetmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transfers")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "from_base_id", nullable = false)
    private Integer fromBaseId;

    @Column(name = "to_base_id", nullable = false)
    private Integer toBaseId;

    @Column(name = "asset_type_id", nullable = false)
    private Integer assetTypeId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "transfer_date", nullable = false)
    private LocalDate transferDate;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    public Transfer() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFromBaseId() {
        return fromBaseId;
    }

    public void setFromBaseId(Integer fromBaseId) {
        this.fromBaseId = fromBaseId;
    }

    public Integer getToBaseId() {
        return toBaseId;
    }

    public void setToBaseId(Integer toBaseId) {
        this.toBaseId = toBaseId;
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

    public LocalDate getTransferDate() {
        return transferDate;
    }

    public void setTransferDate(LocalDate transferDate) {
        this.transferDate = transferDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }
}