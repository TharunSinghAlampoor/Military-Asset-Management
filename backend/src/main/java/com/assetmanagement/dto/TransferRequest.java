package com.assetmanagement.dto;

import java.time.LocalDate;

public class TransferRequest {

    private Integer fromBaseId;
    private Integer toBaseId;
    private Integer assetTypeId;
    private Integer quantity;
    private LocalDate transferDate;
    private String status;

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
}