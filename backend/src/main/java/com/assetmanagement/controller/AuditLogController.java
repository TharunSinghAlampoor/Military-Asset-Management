package com.assetmanagement.controller;

import com.assetmanagement.entity.AuditLog;
import com.assetmanagement.service.AuditLogService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;


    public AuditLogController(
            AuditLogService auditLogService) {

        this.auditLogService = auditLogService;
    }


    // =========================================================
    // GET ALL AUDIT LOGS
    // =========================================================

    @GetMapping
    public List<AuditLog> getAllLogs() {

        return auditLogService.getAllLogs();
    }


    // =========================================================
    // CREATE AUDIT LOG
    // =========================================================

    @PostMapping
    public AuditLog createLog(
            @RequestBody AuditLog auditLog) {

        return auditLogService.createLog(
            auditLog
        );
    }
}