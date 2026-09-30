package com.assetmanagement.dto;

import com.assetmanagement.entity.Role;
import java.time.LocalDateTime;

public class UserResponse {

    private Integer id;
    private String name;
    private String email;
    private Role role;
    private Integer baseId;
    private LocalDateTime createdAt;

    public UserResponse(
            Integer id,
            String name,
            String email,
            Role role,
            Integer baseId,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.baseId = baseId;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public Integer getBaseId() {
        return baseId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}