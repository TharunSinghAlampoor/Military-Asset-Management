package com.assetmanagement.controller;

import com.assetmanagement.dto.DashboardSummary;
import com.assetmanagement.repository.AssetTypeRepository;
import com.assetmanagement.repository.AssignmentRepository;
import com.assetmanagement.repository.BaseRepository;
import com.assetmanagement.repository.ExpenditureRepository;
import com.assetmanagement.repository.InventoryRepository;
import com.assetmanagement.repository.PurchaseRepository;
import com.assetmanagement.repository.TransferRepository;
import com.assetmanagement.service.DashboardService;
import com.assetmanagement.service.RbacService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {


    // =========================================================
    // REPOSITORIES
    // =========================================================

    private final BaseRepository baseRepository;

    private final AssetTypeRepository assetTypeRepository;

    private final InventoryRepository inventoryRepository;

    private final PurchaseRepository purchaseRepository;

    private final TransferRepository transferRepository;

    private final AssignmentRepository assignmentRepository;

    private final ExpenditureRepository expenditureRepository;


    // =========================================================
    // SERVICES
    // =========================================================

    private final RbacService rbacService;

    private final DashboardService dashboardService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public DashboardController(

            BaseRepository baseRepository,

            AssetTypeRepository assetTypeRepository,

            InventoryRepository inventoryRepository,

            PurchaseRepository purchaseRepository,

            TransferRepository transferRepository,

            AssignmentRepository assignmentRepository,

            ExpenditureRepository expenditureRepository,

            RbacService rbacService,

            DashboardService dashboardService) {


        this.baseRepository =
                baseRepository;

        this.assetTypeRepository =
                assetTypeRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.purchaseRepository =
                purchaseRepository;

        this.transferRepository =
                transferRepository;

        this.assignmentRepository =
                assignmentRepository;

        this.expenditureRepository =
                expenditureRepository;

        this.rbacService =
                rbacService;

        this.dashboardService =
                dashboardService;
    }


    // =========================================================
    // API 1
    // =========================================================
    //
    // GET /api/dashboard/summary
    //
    // Used for the dashboard cards:
    //
    // Total Bases
    // Total Asset Types
    // Total Inventory Records
    // Total Purchases
    // Total Transfers
    // Total Assignments
    // Total Expenditures
    //
    // =========================================================

    @GetMapping("/summary")
    public Map<String, Long> getSummary() {


        Map<String, Long> summary =
                new HashMap<>();


        // =====================================================
        // ADMIN
        // =====================================================

        if (rbacService.isAdmin()) {


            summary.put(
                    "totalBases",
                    baseRepository.count()
            );


            summary.put(
                    "totalAssetTypes",
                    assetTypeRepository.count()
            );


            summary.put(
                    "totalInventoryRecords",
                    inventoryRepository.count()
            );


            summary.put(
                    "totalPurchases",
                    purchaseRepository.count()
            );


            summary.put(
                    "totalTransfers",
                    transferRepository.count()
            );


            summary.put(
                    "totalAssignments",
                    assignmentRepository.count()
            );


            summary.put(
                    "totalExpenditures",
                    expenditureRepository.count()
            );


            return summary;
        }


        // =====================================================
        // LOGISTICS OFFICER
        // =====================================================

        if (rbacService.isLogisticsOfficer()) {


            summary.put(
                    "totalBases",
                    baseRepository.count()
            );


            summary.put(
                    "totalAssetTypes",
                    assetTypeRepository.count()
            );


            summary.put(
                    "totalInventoryRecords",
                    inventoryRepository.count()
            );


            summary.put(
                    "totalPurchases",
                    purchaseRepository.count()
            );


            summary.put(
                    "totalTransfers",
                    transferRepository.count()
            );


            // Logistics Officer cannot access
            // assignments and expenditures.

            summary.put(
                    "totalAssignments",
                    0L
            );


            summary.put(
                    "totalExpenditures",
                    0L
            );


            return summary;
        }


        // =====================================================
        // BASE COMMANDER
        // =====================================================

        if (rbacService.isBaseCommander()) {


            Integer baseId =
                    rbacService
                            .getCurrentUser()
                            .getBaseId();


            if (baseId == null) {

                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }


            // -------------------------------------------------
            // INVENTORY COUNT
            // -------------------------------------------------

            long inventoryCount =
                    inventoryRepository
                            .findAll()
                            .stream()
                            .filter(
                                    inventory ->
                                            baseId.equals(
                                                    inventory.getBaseId()
                                            )
                            )
                            .count();


            // -------------------------------------------------
            // PURCHASE COUNT
            // -------------------------------------------------

            long purchaseCount =
                    purchaseRepository
                            .findAll()
                            .stream()
                            .filter(
                                    purchase ->
                                            baseId.equals(
                                                    purchase.getBaseId()
                                            )
                            )
                            .count();


            // -------------------------------------------------
            // TRANSFER COUNT
            // -------------------------------------------------

            long transferCount =
                    transferRepository
                            .findAll()
                            .stream()
                            .filter(
                                    transfer ->
                                            baseId.equals(
                                                    transfer.getFromBaseId()
                                            )
                            )
                            .count();


            // -------------------------------------------------
            // ASSIGNMENT COUNT
            // -------------------------------------------------

            long assignmentCount =
                    assignmentRepository
                            .findAll()
                            .stream()
                            .filter(
                                    assignment ->
                                            baseId.equals(
                                                    assignment.getBaseId()
                                            )
                            )
                            .count();


            // -------------------------------------------------
            // EXPENDITURE COUNT
            // -------------------------------------------------

            long expenditureCount =
                    expenditureRepository
                            .findAll()
                            .stream()
                            .filter(
                                    expenditure ->
                                            baseId.equals(
                                                    expenditure.getBaseId()
                                            )
                            )
                            .count();


            summary.put(
                    "totalBases",
                    1L
            );


            summary.put(
                    "totalAssetTypes",
                    assetTypeRepository.count()
            );


            summary.put(
                    "totalInventoryRecords",
                    inventoryCount
            );


            summary.put(
                    "totalPurchases",
                    purchaseCount
            );


            summary.put(
                    "totalTransfers",
                    transferCount
            );


            summary.put(
                    "totalAssignments",
                    assignmentCount
            );


            summary.put(
                    "totalExpenditures",
                    expenditureCount
            );


            return summary;
        }


        // =====================================================
        // UNAUTHORIZED
        // =====================================================

        throw new RuntimeException(
                "You are not authorized to view dashboard data."
        );
    }


    // =========================================================
    // API 2
    // =========================================================
    //
    // GET /api/dashboard/details
    //
    // Example:
    //
    // /api/dashboard/details
    //
    // /api/dashboard/details?baseId=1
    //
    // /api/dashboard/details?assetTypeId=2
    //
    // /api/dashboard/details?fromDate=2026-09-01
    //
    // /api/dashboard/details?fromDate=2026-09-01&toDate=2026-09-30
    //
    // /api/dashboard/details?baseId=1&assetTypeId=2
    //
    // =========================================================

    @GetMapping("/details")
    public DashboardSummary getDashboardDetails(


            // =================================================
            // FROM DATE
            // =================================================

            @RequestParam(
                    required = false
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate fromDate,


            // =================================================
            // TO DATE
            // =================================================

            @RequestParam(
                    required = false
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate toDate,


            // =================================================
            // BASE ID
            // =================================================

            @RequestParam(
                    required = false
            )
            Integer baseId,


            // =================================================
            // ASSET TYPE ID
            // =================================================

            @RequestParam(
                    required = false
            )
            Integer assetTypeId) {


        // =====================================================
        // SEND FILTERS TO DASHBOARD SERVICE
        // =====================================================

        return dashboardService.getDashboardSummary(

                fromDate,

                toDate,

                baseId,

                assetTypeId

        );
    }
}