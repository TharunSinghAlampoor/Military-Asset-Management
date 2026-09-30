package com.assetmanagement.service;

import com.assetmanagement.entity.Assignment;
import com.assetmanagement.entity.Inventory;

import com.assetmanagement.repository.AssignmentRepository;
import com.assetmanagement.repository.InventoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AuditLogService auditLogService;
    private final InventoryRepository inventoryRepository;
    private final RbacService rbacService;


    public AssignmentService(
            AssignmentRepository assignmentRepository,
            AuditLogService auditLogService,
            InventoryRepository inventoryRepository,
            RbacService rbacService) {

        this.assignmentRepository = assignmentRepository;
        this.auditLogService = auditLogService;
        this.inventoryRepository = inventoryRepository;
        this.rbacService = rbacService;
    }


    // =========================================================
    // GET ALL ASSIGNMENTS
    // =========================================================

    public List<Assignment> getAllAssignments() {

        List<Assignment> assignments =
            assignmentRepository.findAll();


        // ADMIN -> all
        if (rbacService.isAdmin()) {
            return assignments;
        }


        // LOGISTICS OFFICER -> all
        if (rbacService.isLogisticsOfficer()) {
            return assignments;
        }


        // BASE COMMANDER -> own base only
        if (rbacService.isBaseCommander()) {

            Integer baseId =
                rbacService.getCurrentUser().getBaseId();


            if (baseId == null) {

                throw new RuntimeException(
                    "Base Commander is not assigned to any base."
                );
            }


            return assignments.stream()
                .filter(assignment ->
                    assignment.getBaseId().equals(baseId)
                )
                .toList();
        }


        throw new RuntimeException(
            "You are not authorized to view assignments."
        );
    }


    // =========================================================
    // GET ASSIGNMENT BY ID
    // =========================================================

    public Assignment getAssignmentById(Integer id) {

        Assignment assignment =
            assignmentRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Assignment not found with this id : "
                    + id
                )
            );


        rbacService.requireBaseAccess(
            assignment.getBaseId()
        );


        return assignment;
    }


    // =========================================================
    // CREATE ASSIGNMENT
    // =========================================================

    @Transactional
    public Assignment createAssignment(
            Assignment assignment) {


        // Check base access
        rbacService.requireBaseAccess(
            assignment.getBaseId()
        );


        Inventory inventory =
            inventoryRepository
                .findByBaseIdAndAssetTypeId(
                    assignment.getBaseId(),
                    assignment.getAssetTypeId()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "Inventory record not found."
                    )
                );


        // Check quantity
        if (inventory.getQuantity()
                < assignment.getQuantity()) {

            throw new RuntimeException(
                "Insufficient inventory for this assignment."
            );
        }


        // Decrease inventory
        inventory.setQuantity(
            inventory.getQuantity()
            - assignment.getQuantity()
        );


        inventoryRepository.save(
            inventory
        );


        assignment.setCreatedBy(
            rbacService.getCurrentUser().getId()
        );

        Assignment savedAssignment =
            assignmentRepository.save(
                assignment
            );


        // Audit log
        auditLogService.logAction(
            null,
            "CREATE",
            "ASSIGNMENT",
            savedAssignment.getId(),
            "Created assignment for : "
            + savedAssignment.getPersonName()
        );


        return savedAssignment;
    }


    // =========================================================
    // UPDATE ASSIGNMENT
    // =========================================================

    @Transactional
    public Assignment updateAssignment(
            Integer id,
            Assignment updatedAssignment) {


        Assignment existingAssignment =
            assignmentRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Assignment not found with this id : "
                    + id
                )
            );


        // Check old base access
        rbacService.requireBaseAccess(
            existingAssignment.getBaseId()
        );


        // Check new base access
        rbacService.requireBaseAccess(
            updatedAssignment.getBaseId()
        );


        // =====================================================
        // RESTORE OLD INVENTORY
        // =====================================================

        Inventory oldInventory =
            inventoryRepository
                .findByBaseIdAndAssetTypeId(
                    existingAssignment.getBaseId(),
                    existingAssignment.getAssetTypeId()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "Old inventory record not found."
                    )
                );


        oldInventory.setQuantity(
            oldInventory.getQuantity()
            + existingAssignment.getQuantity()
        );


        inventoryRepository.save(
            oldInventory
        );


        // =====================================================
        // APPLY NEW ASSIGNMENT
        // =====================================================

        Inventory newInventory =
            inventoryRepository
                .findByBaseIdAndAssetTypeId(
                    updatedAssignment.getBaseId(),
                    updatedAssignment.getAssetTypeId()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "New inventory record not found."
                    )
                );


        if (newInventory.getQuantity()
                < updatedAssignment.getQuantity()) {

            throw new RuntimeException(
                "Insufficient inventory for this assignment."
            );
        }


        newInventory.setQuantity(
            newInventory.getQuantity()
            - updatedAssignment.getQuantity()
        );


        inventoryRepository.save(
            newInventory
        );


        // =====================================================
        // UPDATE ASSIGNMENT
        // =====================================================

        existingAssignment.setBaseId(
            updatedAssignment.getBaseId()
        );

        existingAssignment.setAssetTypeId(
            updatedAssignment.getAssetTypeId()
        );

        existingAssignment.setPersonName(
            updatedAssignment.getPersonName()
        );

        existingAssignment.setQuantity(
            updatedAssignment.getQuantity()
        );

        existingAssignment.setAssignedDate(
            updatedAssignment.getAssignedDate()
        );


        // IMPORTANT:
        // Do NOT change createdBy during update.


        Assignment savedAssignment =
            assignmentRepository.save(
                existingAssignment
            );


        // Audit log
        auditLogService.logAction(
            null,
            "UPDATE",
            "ASSIGNMENT",
            savedAssignment.getId(),
            "Updated assignment for : "
            + savedAssignment.getPersonName()
        );


        return savedAssignment;
    }


    // =========================================================
    // DELETE ASSIGNMENT
    // =========================================================

    @Transactional
    public void deleteAssignment(Integer id) {


        Assignment existingAssignment =
            assignmentRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "Assignment not found with this id : "
                    + id
                )
            );


        // Check base access
        rbacService.requireBaseAccess(
            existingAssignment.getBaseId()
        );


        Inventory inventory =
            inventoryRepository
                .findByBaseIdAndAssetTypeId(
                    existingAssignment.getBaseId(),
                    existingAssignment.getAssetTypeId()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "Inventory record not found."
                    )
                );


        // Restore assigned quantity
        inventory.setQuantity(
            inventory.getQuantity()
            + existingAssignment.getQuantity()
        );


        inventoryRepository.save(
            inventory
        );


        // Audit log
        auditLogService.logAction(
            null,
            "DELETE",
            "ASSIGNMENT",
            existingAssignment.getId(),
            "Deleted assignment for : "
            + existingAssignment.getPersonName()
        );


        assignmentRepository.delete(
            existingAssignment
        );
    }
}