package com.assetmanagement.controller;

import com.assetmanagement.entity.Base;
import com.assetmanagement.service.BaseService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bases")
public class BaseController {

    private final BaseService baseService;


    public BaseController(
            BaseService baseService) {

        this.baseService = baseService;
    }


    // =========================================================
    // GET ALL BASES
    // ADMIN + BASE COMMANDER + LOGISTICS OFFICER
    // =========================================================

    @GetMapping
    public List<Base> getAllBases() {

        return baseService.getAllBases();
    }


    // =========================================================
    // GET BASE BY ID
    // ADMIN + BASE COMMANDER + LOGISTICS OFFICER
    // =========================================================

    @GetMapping("/{id}")
    public Base getBaseById(
            @PathVariable Integer id) {

        return baseService.getBaseById(id);
    }


    // =========================================================
    // CREATE BASE
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    public Base createBase(
            @RequestBody Base base) {

        return baseService.createBase(
            base
        );
    }


    // =========================================================
    // UPDATE BASE
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{id}")
    public Base updateBase(
            @PathVariable Integer id,
            @RequestBody Base base) {

        return baseService.updateBase(
            id,
            base
        );
    }


    // =========================================================
    // DELETE BASE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteBase(
            @PathVariable Integer id) {

        baseService.deleteBase(id);

        return "Base deleted successfully.";
    }
}