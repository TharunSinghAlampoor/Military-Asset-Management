package com.assetmanagement.service;

import com.assetmanagement.entity.User;
import com.assetmanagement.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

@Service
public class RbacService {

    private final UserRepository userRepository;


    public RbacService(
            UserRepository userRepository) {

        this.userRepository =
                userRepository;
    }


    // =========================================================
    // GET CURRENT LOGGED-IN USER
    // =========================================================

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }


        if (authentication.getPrincipal() == null) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }


        Object principal =
                authentication.getPrincipal();


        if (!(principal instanceof Integer)) {

            throw new RuntimeException(
                    "Invalid authenticated user."
            );
        }


        Integer userId =
                (Integer) principal;


        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user is not found."
                        )
                );
    }


    // =========================================================
    // GET CURRENT ROLE
    // =========================================================

    public String getCurrentRole() {

        return getCurrentUser()
                .getRole()
                .name();
    }


    // =========================================================
    // ROLE CHECKS
    // =========================================================

    public boolean isAdmin() {

        return getCurrentRole()
                .equals("ADMIN");
    }


    public boolean isBaseCommander() {

        return getCurrentRole()
                .equals("BASE_COMMANDER");
    }


    public boolean isLogisticsOfficer() {

        return getCurrentRole()
                .equals("LOGISTICS_OFFICER");
    }


    // =========================================================
    // ADMIN ONLY
    // =========================================================

    public void requireAdmin() {

        if (!isAdmin()) {

            throw new RuntimeException(
                    "Only ADMIN can perform this operation."
            );
        }
    }


    // =========================================================
    // ADMIN OR BASE COMMANDER
    // =========================================================

    public void requireAdminOrBaseCommander() {

        String role =
                getCurrentRole();


        if (role.equals("ADMIN")) {

            return;
        }


        if (role.equals("BASE_COMMANDER")) {

            return;
        }


        throw new RuntimeException(
                "Only ADMIN or BASE COMMANDER can perform this operation."
        );
    }


    // =========================================================
    // BASE ACCESS
    //
    // ADMIN
    //      -> All bases
    //
    // BASE COMMANDER
    //      -> Own assigned base only
    //
    // LOGISTICS OFFICER
    //      -> Base-level access for permitted
    //         purchase/transfer operations
    // =========================================================

    public void requireBaseAccess(
            Integer baseId) {


        if (baseId == null) {

            throw new RuntimeException(
                    "Base ID is required."
            );
        }


        User user =
                getCurrentUser();


        String role =
                user.getRole().name();


        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        if (role.equals("ADMIN")) {

            return;
        }


        // -----------------------------------------------------
        // BASE COMMANDER
        // -----------------------------------------------------

        if (role.equals("BASE_COMMANDER")) {

            if (user.getBaseId() == null) {

                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }


            if (!user.getBaseId()
                    .equals(baseId)) {

                throw new RuntimeException(
                        "You can only manage data for your own base."
                );
            }


            return;
        }


        // -----------------------------------------------------
        // LOGISTICS OFFICER
        //
        // Logistics Officer should not automatically receive
        // general access through this method.
        // Purchase/Transfer methods should use their specific
        // access methods below.
        // -----------------------------------------------------

        if (role.equals("LOGISTICS_OFFICER")) {

            throw new RuntimeException(
                    "Logistics Officer has limited access."
            );
        }


        throw new RuntimeException(
                "You are not authorized to perform this operation."
        );
    }


    // =========================================================
    // PURCHASE ACCESS
    //
    // ADMIN
    //      -> All bases
    //
    // BASE COMMANDER
    //      -> Own assigned base
    //
    // LOGISTICS OFFICER
    //      -> Purchase operations allowed
    // =========================================================

    public void requirePurchaseAccess(
            Integer baseId) {


        if (baseId == null) {

            throw new RuntimeException(
                    "Base ID is required."
            );
        }


        User user =
                getCurrentUser();


        String role =
                user.getRole().name();


        // ADMIN

        if (role.equals("ADMIN")) {

            return;
        }


        // BASE COMMANDER

        if (role.equals("BASE_COMMANDER")) {

            if (user.getBaseId() == null) {

                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }


            if (!user.getBaseId()
                    .equals(baseId)) {

                throw new RuntimeException(
                        "You can only manage purchases for your own base."
                );
            }


            return;
        }


        // LOGISTICS OFFICER

        if (role.equals("LOGISTICS_OFFICER")) {

            return;
        }


        throw new RuntimeException(
                "You are not authorized to manage purchases."
        );
    }


    // =========================================================
    // TRANSFER ACCESS
    //
    // ADMIN
    //      -> Any base to any base
    //
    // BASE COMMANDER
    //      -> Transfers FROM their own base
    //
    // LOGISTICS OFFICER
    //      -> Transfer operations allowed
    // =========================================================

    public void requireTransferAccess(
            Integer fromBaseId,
            Integer toBaseId) {


        if (fromBaseId == null
                || toBaseId == null) {

            throw new RuntimeException(
                    "Source base and destination base are required."
            );
        }


        if (fromBaseId.equals(toBaseId)) {

            throw new RuntimeException(
                    "Source base and destination base cannot be the same."
            );
        }


        User user =
                getCurrentUser();


        String role =
                user.getRole().name();


        // ADMIN

        if (role.equals("ADMIN")) {

            return;
        }


        // BASE COMMANDER

        if (role.equals("BASE_COMMANDER")) {

            if (user.getBaseId() == null) {

                throw new RuntimeException(
                        "Base Commander is not assigned to any base."
                );
            }


            if (!user.getBaseId()
                    .equals(fromBaseId)) {

                throw new RuntimeException(
                        "You can only transfer assets from your own base."
                );
            }


            return;
        }


        // LOGISTICS OFFICER

        if (role.equals("LOGISTICS_OFFICER")) {

            return;
        }


        throw new RuntimeException(
                "You are not authorized to perform transfers."
        );
    }


    // =========================================================
    // LOGISTICS OFFICER
    //
    // According to the assignment:
    //
    // Logistics Officer:
    // Limited access to purchases and transfers.
    //
    // =========================================================

    public void requireLogisticsAccess() {

        if (!isLogisticsOfficer()) {

            throw new RuntimeException(
                    "Only LOGISTICS OFFICER can perform this operation."
            );
        }
    }


    // =========================================================
    // PURCHASE OR TRANSFER ACCESS
    //
    // Useful for controllers/services where both ADMIN,
    // BASE COMMANDER and LOGISTICS OFFICER are allowed.
    // =========================================================

    public void requirePurchaseOrTransferAccess() {

        String role =
                getCurrentRole();


        if (role.equals("ADMIN")) {

            return;
        }


        if (role.equals("BASE_COMMANDER")) {

            return;
        }


        if (role.equals("LOGISTICS_OFFICER")) {

            return;
        }


        throw new RuntimeException(
                "You are not authorized for purchase or transfer operations."
        );
    }


    // =========================================================
    // VIEW ALL BASES
    //
    // ADMIN
    // LOGISTICS OFFICER
    //
    // Base Commander is restricted to own base.
    // =========================================================

    public void requireAllBaseViewAccess() {

        if (isAdmin()) {

            return;
        }


        if (isLogisticsOfficer()) {

            return;
        }


        throw new RuntimeException(
                "You are not authorized to view data for all bases."
        );
    }
}