package com.assetmanagement.controller;

import com.assetmanagement.dto.TransferRequest;
import com.assetmanagement.entity.Transfer;
import com.assetmanagement.service.TransferService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(
            TransferService transferService) {

        this.transferService = transferService;
    }


    // =========================================================
    // GET ALL TRANSFERS
    // =========================================================

    @GetMapping
    public List<Transfer> getAllTransfers() {

        return transferService.getAllTransfers();
    }


    // =========================================================
    // GET TRANSFER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Transfer getTransferById(
            @PathVariable Integer id) {

        return transferService.getTransferById(id);
    }


    // =========================================================
    // CREATE TRANSFER
    // =========================================================

    @PostMapping
    public Transfer createTransfer(
            @RequestBody Transfer transfer) {

        return transferService.createTransfer(
            transfer
        );
    }


    // =========================================================
    // UPDATE TRANSFER
    // =========================================================

    @PutMapping("/{id}")
    public Transfer updateTransfer(
            @PathVariable Integer id,
            @RequestBody TransferRequest request) {

        Transfer transfer = new Transfer();

        transfer.setFromBaseId(
            request.getFromBaseId()
        );

        transfer.setToBaseId(
            request.getToBaseId()
        );

        transfer.setAssetTypeId(
            request.getAssetTypeId()
        );

        transfer.setQuantity(
            request.getQuantity()
        );

        transfer.setTransferDate(
            request.getTransferDate()
        );

        transfer.setStatus(
            request.getStatus()
        );

        return transferService.updateTransfer(
            id,
            transfer
        );
    }


    // =========================================================
    // DELETE TRANSFER
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteTransfer(
            @PathVariable Integer id) {

        transferService.deleteTransfer(id);

        return "Transfer deleted successfully.";
    }
}