package com.assetmanagement.controller;

import com.assetmanagement.entity.User;
import com.assetmanagement.dto.UserResponse;
import com.assetmanagement.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }


    // =========================================================
    // GET ALL USERS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers()
            .stream()
            .map(user ->
                new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getBaseId(),
                    user.getCreatedAt()
                )
            )
            .toList();
    }


    // =========================================================
    // CREATE USER
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    public UserResponse createUser(
            @RequestBody User user) {

        User savedUser =
            userService.createUser(user);


        return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getBaseId(),
            savedUser.getCreatedAt()
        );
    }


    // =========================================================
    // UPDATE USER
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Integer id,
            @RequestBody User user) {


        User updatedUser =
            userService.updateUser(
                id,
                user
            );


        return new UserResponse(
            updatedUser.getId(),
            updatedUser.getName(),
            updatedUser.getEmail(),
            updatedUser.getRole(),
            updatedUser.getBaseId(),
            updatedUser.getCreatedAt()
        );
    }


    // =========================================================
    // DELETE USER
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Integer id) {


        userService.deleteUser(id);


        return "User Deleted Successfully.";
    }
}