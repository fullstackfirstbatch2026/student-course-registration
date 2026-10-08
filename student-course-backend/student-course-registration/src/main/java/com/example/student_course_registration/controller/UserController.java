package com.example.student_course_registration.controller;

import com.example.student_course_registration.entity.User;
import com.example.student_course_registration.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ==========================================
    // CREATE USER
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user) {

        try {
            User createdUser =
                    userService.createUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdUser);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // GET CURRENT USER PROFILE
    // ==========================================

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            Authentication authentication) {

        try {
            User user =
                    userService.getUserByUsername(
                            authentication.getName()
                    );

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // CHANGE CURRENT USER PASSWORD
    // ==========================================

    @PutMapping("/me/password")
    public ResponseEntity<?> changeMyPassword(
            Authentication authentication,
            @RequestBody PasswordChangeRequest request) {

        try {
            User user =
                    userService.updatePassword(
                            authentication.getName(),
                            request.getCurrentPassword(),
                            request.getNewPassword()
                    );

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // PASSWORD CHANGE REQUEST
    // ==========================================

    public static class PasswordChangeRequest {

        private String currentPassword;
        private String newPassword;

        public PasswordChangeRequest() {
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(
                String currentPassword) {
            this.currentPassword =
                    currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(
                String newPassword) {
            this.newPassword =
                    newPassword;
        }
    }
}