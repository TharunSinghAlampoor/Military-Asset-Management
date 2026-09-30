package com.assetmanagement.controller;

import com.assetmanagement.entity.Expenditure;
import com.assetmanagement.service.ExpenditureService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenditures")
public class ExpenditureController {

    private final ExpenditureService expenditureService;


    public ExpenditureController(
            ExpenditureService expenditureService) {

        this.expenditureService = expenditureService;
    }


    // =========================================================
    // GET ALL EXPENDITURES
    // =========================================================

    @GetMapping
    public List<Expenditure> getAllExpenditures() {

        return expenditureService.getAllExpenditures();
    }


    // =========================================================
    // GET EXPENDITURE BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Expenditure getExpenditureById(
            @PathVariable Integer id) {

        return expenditureService.getExpenditureById(id);
    }


    // =========================================================
    // CREATE EXPENDITURE
    // =========================================================

    @PostMapping
    public Expenditure createExpenditure(
            @RequestBody Expenditure expenditure) {

        return expenditureService.createExpenditure(
            expenditure
        );
    }


    // =========================================================
    // UPDATE EXPENDITURE
    // =========================================================

    @PutMapping("/{id}")
    public Expenditure updateExpenditure(
            @PathVariable Integer id,
            @RequestBody Expenditure expenditure) {

        return expenditureService.updateExpenditure(
            id,
            expenditure
        );
    }


    // =========================================================
    // DELETE EXPENDITURE
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteExpenditure(
            @PathVariable Integer id) {

        expenditureService.deleteExpenditure(id);

        return "Expenditure deleted successfully.";
    }
}