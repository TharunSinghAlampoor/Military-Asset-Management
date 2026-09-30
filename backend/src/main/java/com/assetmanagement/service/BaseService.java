package com.assetmanagement.service;

import com.assetmanagement.entity.Base;
import com.assetmanagement.repository.BaseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaseService {

    private final BaseRepository baseRepository;
    private final AuditLogService auditLogService;
    private final RbacService rbacService;

    public BaseService(
            BaseRepository baseRepository,
            AuditLogService auditLogService,
            RbacService rbacService) {

        this.baseRepository = baseRepository;
        this.auditLogService = auditLogService;
        this.rbacService = rbacService;
    }

    public List<Base> getAllBases() {

        return baseRepository.findAll();
    }

    public Base getBaseById(Integer id) {

        return baseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Base not found with this id: " + id
            ));
    }

    public Base createBase(Base base) {

        rbacService.requireAdmin();

        Base savedBase =
            baseRepository.save(base);

        auditLogService.logAction(
            null,
            "CREATE",
            "BASE",
            savedBase.getId(),
            "Created base: "
            + savedBase.getName()
        );

        return savedBase;
    }

    public Base updateBase(
            Integer id,
            Base updatedBase) {

        rbacService.requireAdminOrBaseCommander();

        Base existingBase =
            baseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Base not found with this id: " + id
            ));

        existingBase.setName(
            updatedBase.getName()
        );

        existingBase.setLocation(
            updatedBase.getLocation()
        );

        Base savedBase =
            baseRepository.save(existingBase);

        auditLogService.logAction(
            null,
            "UPDATE",
            "BASE",
            savedBase.getId(),
            "Updated base: "
            + savedBase.getName()
        );

        return savedBase;
    }

    public void deleteBase(Integer id) {

        rbacService.requireAdminOrBaseCommander();

        Base existingBase =
            baseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Base not found with this id: " + id
            ));

        auditLogService.logAction(
            null,
            "DELETE",
            "BASE",
            existingBase.getId(),
            "Deleted base: "
            + existingBase.getName()
        );

        baseRepository.delete(existingBase);
    }
}