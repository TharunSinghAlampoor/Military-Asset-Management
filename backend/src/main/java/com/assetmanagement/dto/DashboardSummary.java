package com.assetmanagement.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummary {

    private Integer assetTypeId;
    private String assetName;
    private String category;

    private Integer openingBalance;
    private Integer closingBalance;
    private Integer purchases;
    private Integer transferIn;
    private Integer transferOut;
    private Integer netMovement;
    private Integer assigned;
    private Integer expended;

    /*
     * All assets with their quantities.
     */
    private List<Map<String, Object>> assetItems;

    public DashboardSummary() {
    }

    /*
     * Existing constructor.
     * Kept so existing code continues to work.
     */
    public DashboardSummary(
            Integer openingBalance,
            Integer closingBalance,
            Integer purchases,
            Integer transferIn,
            Integer transferOut,
            Integer netMovement,
            Integer assigned,
            Integer expended) {

        this.openingBalance = openingBalance;
        this.closingBalance = closingBalance;
        this.purchases = purchases;
        this.transferIn = transferIn;
        this.transferOut = transferOut;
        this.netMovement = netMovement;
        this.assigned = assigned;
        this.expended = expended;
    }

    /*
     * Constructor with asset information.
     */
    public DashboardSummary(
            Integer assetTypeId,
            String assetName,
            String category,
            Integer openingBalance,
            Integer closingBalance,
            Integer purchases,
            Integer transferIn,
            Integer transferOut,
            Integer netMovement,
            Integer assigned,
            Integer expended) {

        this.assetTypeId = assetTypeId;
        this.assetName = assetName;
        this.category = category;
        this.openingBalance = openingBalance;
        this.closingBalance = closingBalance;
        this.purchases = purchases;
        this.transferIn = transferIn;
        this.transferOut = transferOut;
        this.netMovement = netMovement;
        this.assigned = assigned;
        this.expended = expended;
    }

    public Integer getAssetTypeId() {
        return assetTypeId;
    }

    public void setAssetTypeId(Integer assetTypeId) {
        this.assetTypeId = assetTypeId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getOpeningBalance() {
        return openingBalance;
    }

    public void setOpeningBalance(Integer openingBalance) {
        this.openingBalance = openingBalance;
    }

    public Integer getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(Integer closingBalance) {
        this.closingBalance = closingBalance;
    }

    public Integer getPurchases() {
        return purchases;
    }

    public void setPurchases(Integer purchases) {
        this.purchases = purchases;
    }

    public Integer getTransferIn() {
        return transferIn;
    }

    public void setTransferIn(Integer transferIn) {
        this.transferIn = transferIn;
    }

    public Integer getTransferOut() {
        return transferOut;
    }

    public void setTransferOut(Integer transferOut) {
        this.transferOut = transferOut;
    }

    public Integer getNetMovement() {
        return netMovement;
    }

    public void setNetMovement(Integer netMovement) {
        this.netMovement = netMovement;
    }

    public Integer getAssigned() {
        return assigned;
    }

    public void setAssigned(Integer assigned) {
        this.assigned = assigned;
    }

    public Integer getExpended() {
        return expended;
    }

    public void setExpended(Integer expended) {
        this.expended = expended;
    }

    public List<Map<String, Object>> getAssetItems() {
        return assetItems;
    }

    public void setAssetItems(List<Map<String, Object>> assetItems) {
        this.assetItems = assetItems;
    }
}