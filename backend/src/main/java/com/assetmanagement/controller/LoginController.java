package com.assetmanagement.controller;

import com.assetmanagement.dto.LoginRequest;
import com.assetmanagement.dto.LoginResponse;
import com.assetmanagement.entity.User;
import com.assetmanagement.service.JwtService;
import com.assetmanagement.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class LoginController {
    private final UserService userService;
    private final JwtService jwtService;

    public LoginController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        String token = jwtService.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole().name()
        );

        return new LoginResponse(
            token,
            user.getEmail(),
            user.getRole().name()
        );
    }
}