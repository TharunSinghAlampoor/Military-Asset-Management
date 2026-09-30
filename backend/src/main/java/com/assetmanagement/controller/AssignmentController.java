package com.assetmanagement.controller;

import com.assetmanagement.entity.Assignment;
import com.assetmanagement.service.AssignmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;


    public AssignmentController(
            AssignmentService assignmentService) {

        this.assignmentService = assignmentService;
    }


    // =========================================================
    // GET ALL ASSIGNMENTS
    // =========================================================

    @GetMapping
    public List<Assignment> getAllAssignments() {

        return assignmentService.getAllAssignments();
    }


    // =========================================================
    // GET ASSIGNMENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Assignment getAssignmentById(
            @PathVariable Integer id) {

        return assignmentService.getAssignmentById(id);
    }


    // =========================================================
    // CREATE ASSIGNMENT
    // =========================================================

    @PostMapping
    public Assignment createAssignment(
            @RequestBody Assignment assignment) {

        return assignmentService.createAssignment(
            assignment
        );
    }


    // =========================================================
    // UPDATE ASSIGNMENT
    // =========================================================

    @PutMapping("/{id}")
    public Assignment updateAssignment(
            @PathVariable Integer id,
            @RequestBody Assignment assignment) {

        return assignmentService.updateAssignment(
            id,
            assignment
        );
    }


    // =========================================================
    // DELETE ASSIGNMENT
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteAssignment(
            @PathVariable Integer id) {

        assignmentService.deleteAssignment(id);

        return "Assignment deleted successfully.";
    }
}