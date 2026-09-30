package com.assetmanagement.service;

import com.assetmanagement.dto.DashboardSummary;
import com.assetmanagement.entity.Assignment;
import com.assetmanagement.entity.AssetType;
import com.assetmanagement.entity.Expenditure;
import com.assetmanagement.entity.Purchase;
import com.assetmanagement.entity.Role;
import com.assetmanagement.entity.Transfer;
import com.assetmanagement.entity.User;
import com.assetmanagement.entity.Inventory;

import com.assetmanagement.repository.AssignmentRepository;
import com.assetmanagement.repository.AssetTypeRepository;
import com.assetmanagement.repository.ExpenditureRepository;
import com.assetmanagement.repository.InventoryRepository;
import com.assetmanagement.repository.PurchaseRepository;
import com.assetmanagement.repository.TransferRepository;
import com.assetmanagement.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final PurchaseRepository purchaseRepository;
    private final TransferRepository transferRepository;
    private final AssignmentRepository assignmentRepository;
    private final ExpenditureRepository expenditureRepository;
    private final UserRepository userRepository;
    private final AssetTypeRepository assetTypeRepository;
    private final InventoryRepository inventoryRepository;

    public DashboardService(
            PurchaseRepository purchaseRepository,
            TransferRepository transferRepository,
            AssignmentRepository assignmentRepository,
            ExpenditureRepository expenditureRepository,
            UserRepository userRepository,
            AssetTypeRepository assetTypeRepository,
            InventoryRepository inventoryRepository) {

        this.purchaseRepository = purchaseRepository;
        this.transferRepository = transferRepository;
        this.assignmentRepository = assignmentRepository;
        this.expenditureRepository = expenditureRepository;
        this.userRepository = userRepository;
        this.assetTypeRepository = assetTypeRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public DashboardSummary getDashboardSummary(
            LocalDate fromDate,
            LocalDate toDate,
            Integer baseId,
            Integer assetTypeId) {

        User currentUser = getCurrentUser();

        /*
         * BASE_COMMANDER can only see his own base.
         */
        if (currentUser.getRole() == Role.BASE_COMMANDER) {
            baseId = currentUser.getBaseId();
        }

        /*
         * =========================================================
         * ASSET NAME AND CATEGORY
         * =========================================================
         */

        String assetName = null;
        String category = null;

        if (assetTypeId != null) {

            AssetType assetType =
                    assetTypeRepository.findById(assetTypeId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Asset type not found : "
                                                    + assetTypeId));

            assetName = assetType.getName();
            category = assetType.getCategory();
        }

        /*
         * =========================================================
         * LOAD TRANSACTION DATA
         * =========================================================
         */

        List<Purchase> purchases =
                purchaseRepository.findAll();

        List<Transfer> transfers =
                transferRepository.findAll();

        List<Assignment> assignments =
                assignmentRepository.findAll();

        List<Expenditure> expenditures =
                expenditureRepository.findAll();

        /*
         * =========================================================
         * DASHBOARD COUNTERS
         * =========================================================
         */

        int openingBalance = 0;
        int purchaseQuantity = 0;
        int transferIn = 0;
        int transferOut = 0;
        int assigned = 0;
        int expended = 0;

        /*
         * =========================================================
         * OPENING BALANCE
         * =========================================================
         *
         * Transactions before fromDate are considered.
         */

        if (fromDate != null) {

            /*
             * PURCHASES BEFORE FROM DATE
             */

            for (Purchase purchase : purchases) {

                if (purchase.getPurchaseDate() != null
                        && purchase.getPurchaseDate().isBefore(fromDate)
                        && matchesBase(
                                purchase.getBaseId(),
                                baseId)
                        && matchesAssetType(
                                purchase.getAssetTypeId(),
                                assetTypeId)) {

                    openingBalance +=
                            purchase.getQuantity();
                }
            }

            /*
             * TRANSFERS BEFORE FROM DATE
             */

            for (Transfer transfer : transfers) {

                if (transfer.getTransferDate() != null
                        && transfer.getTransferDate().isBefore(fromDate)
                        && matchesAssetType(
                                transfer.getAssetTypeId(),
                                assetTypeId)) {

                    /*
                     * Transfer IN
                     */

                    if (matchesBase(
                            transfer.getToBaseId(),
                            baseId)) {

                        openingBalance +=
                                transfer.getQuantity();
                    }

                    /*
                     * Transfer OUT
                     */

                    if (matchesBase(
                            transfer.getFromBaseId(),
                            baseId)) {

                        openingBalance -=
                                transfer.getQuantity();
                    }
                }
            }

            /*
             * ASSIGNMENTS BEFORE FROM DATE
             */

            for (Assignment assignment : assignments) {

                if (assignment.getAssignedDate() != null
                        && assignment.getAssignedDate().isBefore(fromDate)
                        && matchesBase(
                                assignment.getBaseId(),
                                baseId)
                        && matchesAssetType(
                                assignment.getAssetTypeId(),
                                assetTypeId)) {

                    openingBalance -=
                            assignment.getQuantity();
                }
            }

            /*
             * EXPENDITURES BEFORE FROM DATE
             */

            for (Expenditure expenditure : expenditures) {

                if (expenditure.getExpendedDate() != null
                        && expenditure.getExpendedDate().isBefore(fromDate)
                        && matchesBase(
                                expenditure.getBaseId(),
                                baseId)
                        && matchesAssetType(
                                expenditure.getAssetTypeId(),
                                assetTypeId)) {

                    openingBalance -=
                            expenditure.getQuantity();
                }
            }
        }

        /*
         * =========================================================
         * CURRENT PERIOD - PURCHASES
         * =========================================================
         */

        for (Purchase purchase : purchases) {

            if (matchesDate(
                    purchase.getPurchaseDate(),
                    fromDate,
                    toDate)
                    && matchesBase(
                            purchase.getBaseId(),
                            baseId)
                    && matchesAssetType(
                            purchase.getAssetTypeId(),
                            assetTypeId)) {

                purchaseQuantity +=
                        purchase.getQuantity();
            }
        }

        /*
         * =========================================================
         * CURRENT PERIOD - TRANSFERS
         * =========================================================
         */

        for (Transfer transfer : transfers) {

            if (matchesDate(
                    transfer.getTransferDate(),
                    fromDate,
                    toDate)
                    && matchesAssetType(
                            transfer.getAssetTypeId(),
                            assetTypeId)) {

                /*
                 * TRANSFER IN
                 */

                if (matchesBase(
                        transfer.getToBaseId(),
                        baseId)) {

                    transferIn +=
                            transfer.getQuantity();
                }

                /*
                 * TRANSFER OUT
                 */

                if (matchesBase(
                        transfer.getFromBaseId(),
                        baseId)) {

                    transferOut +=
                            transfer.getQuantity();
                }
            }
        }

        /*
         * =========================================================
         * CURRENT PERIOD - ASSIGNMENTS AND EXPENDITURES
         * =========================================================
         *
         * LOGISTICS_OFFICER does not see these calculations.
         */

        if (currentUser.getRole()
                != Role.LOGISTICS_OFFICER) {

            /*
             * ASSIGNMENTS
             */

            for (Assignment assignment : assignments) {

                if (matchesDate(
                        assignment.getAssignedDate(),
                        fromDate,
                        toDate)
                        && matchesBase(
                                assignment.getBaseId(),
                                baseId)
                        && matchesAssetType(
                                assignment.getAssetTypeId(),
                                assetTypeId)) {

                    assigned +=
                            assignment.getQuantity();
                }
            }

            /*
             * EXPENDITURES
             */

            for (Expenditure expenditure : expenditures) {

                if (matchesDate(
                        expenditure.getExpendedDate(),
                        fromDate,
                        toDate)
                        && matchesBase(
                                expenditure.getBaseId(),
                                baseId)
                        && matchesAssetType(
                                expenditure.getAssetTypeId(),
                                assetTypeId)) {

                    expended +=
                            expenditure.getQuantity();
                }
            }
        }

        /*
         * =========================================================
         * NET MOVEMENT
         * =========================================================
         */

        int netMovement =
                purchaseQuantity
                + transferIn
                - transferOut;

        /*
         * =========================================================
         * CLOSING BALANCE
         * =========================================================
         */

        int closingBalance =
                openingBalance
                + purchaseQuantity
                + transferIn
                - transferOut
                - assigned
                - expended;

        /*
         * =========================================================
         * ASSET ITEMS WITH CURRENT INVENTORY QUANTITY
         * =========================================================
         *
         * This creates:
         *
         * Asset Name
         * Category
         * Quantity
         *
         * for every asset type.
         *
         * If an asset does not have an inventory record,
         * its quantity will be shown as 0.
         */

        List<Map<String, Object>> assetItems =
                new ArrayList<>();

        List<AssetType> assetTypes =
                assetTypeRepository.findAll();

        List<Inventory> inventories =
                inventoryRepository.findAll();

        for (AssetType assetType : assetTypes) {

            /*
             * If a specific asset type is selected,
             * only show that asset.
             */

            if (assetTypeId != null
                    && !assetType.getId()
                    .equals(assetTypeId)) {

                continue;
            }

            int totalQuantity = 0;

            /*
             * Find inventory quantity for this asset.
             */

            for (Inventory inventory : inventories) {

                /*
                 * Check asset type.
                 */

                if (!assetType.getId()
                        .equals(
                                inventory.getAssetTypeId())) {

                    continue;
                }

                /*
                 * Check base.
                 *
                 * ADMIN:
                 * selected base or all bases.
                 *
                 * BASE_COMMANDER:
                 * only own base.
                 *
                 * LOGISTICS_OFFICER:
                 * selected base or all bases.
                 */

                if (!matchesBase(
                        inventory.getBaseId(),
                        baseId)) {

                    continue;
                }

                /*
                 * Add quantity.
                 */

                if (inventory.getQuantity() != null) {

                    totalQuantity +=
                            inventory.getQuantity();
                }
            }

            /*
             * Create one dashboard item.
             */

            Map<String, Object> item =
                    new HashMap<>();

            item.put(
                    "assetTypeId",
                    assetType.getId()
            );

            item.put(
                    "assetName",
                    assetType.getName()
            );

            item.put(
                    "category",
                    assetType.getCategory()
            );

            item.put(
                    "quantity",
                    totalQuantity
            );

            assetItems.add(item);
        }

        /*
         * =========================================================
         * CREATE DASHBOARD RESPONSE
         * =========================================================
         */

        DashboardSummary dashboardSummary =
                new DashboardSummary(
                        assetTypeId,
                        assetName,
                        category,
                        openingBalance,
                        closingBalance,
                        purchaseQuantity,
                        transferIn,
                        transferOut,
                        netMovement,
                        assigned,
                        expended
                );

        /*
         * Add all asset names and quantities.
         */

        dashboardSummary.setAssetItems(
                assetItems
        );

        return dashboardSummary;
    }


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || authentication.getPrincipal() == null) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        Object principal =
                authentication.getPrincipal();

        Integer userId;

        if (principal instanceof Integer) {

            userId =
                    (Integer) principal;

        } else {

            try {

                userId =
                        Integer.valueOf(
                                principal.toString()
                        );

            } catch (NumberFormatException e) {

                throw new RuntimeException(
                        "Invalid authenticated user"
                );
            }
        }

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }


    // =========================================================
    // MATCH BASE
    // =========================================================

    private boolean matchesBase(
            Integer transactionBaseId,
            Integer selectedBaseId) {

        /*
         * No base selected means:
         * show all bases.
         */

        if (selectedBaseId == null) {

            return true;
        }

        return transactionBaseId != null
                && transactionBaseId.equals(
                        selectedBaseId
                );
    }


    // =========================================================
    // MATCH ASSET TYPE
    // =========================================================

    private boolean matchesAssetType(
            Integer transactionAssetTypeId,
            Integer selectedAssetTypeId) {

        /*
         * No asset selected means:
         * show all asset types.
         */

        if (selectedAssetTypeId == null) {

            return true;
        }

        return transactionAssetTypeId != null
                && transactionAssetTypeId.equals(
                        selectedAssetTypeId
                );
    }


    // =========================================================
    // MATCH DATE
    // =========================================================

    private boolean matchesDate(
            LocalDate transactionDate,
            LocalDate fromDate,
            LocalDate toDate) {

        if (transactionDate == null) {

            return false;
        }

        /*
         * Before FROM DATE
         */

        if (fromDate != null
                && transactionDate.isBefore(
                        fromDate)) {

            return false;
        }

        /*
         * After TO DATE
         */

        if (toDate != null
                && transactionDate.isAfter(
                        toDate)) {

            return false;
        }

        return true;
    }
}