package com.assetmanagement.service;

import com.assetmanagement.entity.User;
import com.assetmanagement.repository.UserRepository;

import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // CREATE USER
    // =========================================================

    public User createUser(User user) {

        // Encrypt password before saving
        user.setPassword(
            passwordEncoder.encode(
                user.getPassword()
            )
        );


        return userRepository.save(user);
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public User login(
            String email,
            String password) {


        Optional<User> userOptional =
            userRepository.findByEmail(email);


        if (userOptional.isEmpty()) {

            throw new RuntimeException(
                "Invalid Email or Password"
            );
        }


        User user =
            userOptional.get();


        // Compare entered password
        // with encrypted database password
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                "Invalid Email or Password"
            );
        }


        return user;
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    public User updateUser(
            Integer id,
            User updatedUser) {


        User existingUser =
            userRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "User not found : " + id
                )
            );


        // Update name
        existingUser.setName(
            updatedUser.getName()
        );


        // Update email
        existingUser.setEmail(
            updatedUser.getEmail()
        );


        // Update role
        existingUser.setRole(
            updatedUser.getRole()
        );


        // Update base
        existingUser.setBaseId(
            updatedUser.getBaseId()
        );


        // -----------------------------------------------------
        // Update password only when a new password is provided
        // -----------------------------------------------------

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                passwordEncoder.encode(
                    updatedUser.getPassword()
                )
            );
        }


        return userRepository.save(
            existingUser
        );
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    public void deleteUser(Integer id) {


        User existingUser =
            userRepository.findById(id)

            .orElseThrow(
                () -> new RuntimeException(
                    "User not found : " + id
                )
            );


        userRepository.delete(
            existingUser
        );
    }
}