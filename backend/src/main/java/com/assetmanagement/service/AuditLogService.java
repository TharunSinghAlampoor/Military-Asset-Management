package com.assetmanagement.service;

import com.assetmanagement.entity.AuditLog;
import com.assetmanagement.entity.User;

import com.assetmanagement.repository.AuditLogRepository;
import com.assetmanagement.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;


    public AuditLogService(
            AuditLogRepository auditLogRepository,
            UserRepository userRepository) {

        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // GET ALL AUDIT LOGS
    // =========================================================

    public List<AuditLog> getAllLogs() {

        return auditLogRepository.findAll();
    }


    // =========================================================
    // CREATE AUDIT LOG
    // =========================================================

    public AuditLog createLog(AuditLog auditLog) {

        return auditLogRepository.save(
            auditLog
        );
    }


    // =========================================================
    // AUTOMATIC AUDIT LOGGING
    // =========================================================

    public void logAction(
            Integer userId,
            String action,
            String entityType,
            Integer entityId,
            String details) {


        // -----------------------------------------------------
        // If userId is not provided, get logged-in user
        // -----------------------------------------------------

        if (userId == null) {

            Authentication authentication =
                SecurityContextHolder
                    .getContext()
                    .getAuthentication();


            if (authentication != null
                    && authentication.getPrincipal() != null
                    && authentication.getPrincipal()
                        instanceof Integer) {

                userId =
                    (Integer) authentication
                        .getPrincipal();
            }
        }


        // -----------------------------------------------------
        // Create audit log
        // -----------------------------------------------------

        AuditLog auditLog =
            new AuditLog();


        auditLog.setUserId(
            userId
        );


        auditLog.setAction(
            action
        );


        auditLog.setEntityType(
            entityType
        );


        auditLog.setEntityId(
            entityId
        );


        auditLog.setDetails(
            details
        );


        // -----------------------------------------------------
        // Save audit log
        // -----------------------------------------------------

        auditLogRepository.save(
            auditLog
        );
    }
}