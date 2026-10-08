package com.example.student_course_registration.controller;

import com.example.student_course_registration.dto.LoginRequest;
import com.example.student_course_registration.entity.User;
import com.example.student_course_registration.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService) {

        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUsername(),
                                loginRequest.getPassword()
                        )
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(
                context,
                request,
                response
        );

        return ResponseEntity.ok(
                "Login successful for user: "
                        + authentication.getName()
        );
    }

    // ==========================================
    // REGISTER / SIGN UP
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        try {

            // Never allow public registration to
            // create an ADMIN account.
            user.setRole("USER");

            User createdUser =
                    userService.createUser(user);

            Map<String, String> result =
                    new HashMap<>();

            result.put(
                    "message",
                    "Registration successful"
            );

            result.put(
                    "username",
                    createdUser.getUsername()
            );

            result.put(
                    "role",
                    createdUser.getRole()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(result);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // CURRENT LOGGED-IN USER
    // ==========================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");
        }

        Map<String, String> user =
                new HashMap<>();

        user.put(
                "username",
                authentication.getName()
        );

        String role =
                authentication.getAuthorities()
                        .stream()
                        .findFirst()
                        .map(authority ->
                                authority.getAuthority())
                        .orElse("ROLE_USER");

        user.put(
                "role",
                role.replace("ROLE_", "")
        );

        return ResponseEntity.ok(user);
    }

    // ==========================================
    // LOGOUT
    // ==========================================

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        SecurityContextHolder.clearContext();

        request.getSession(false);

        return ResponseEntity.ok(
                "Logout successful"
        );
    }
}