package com.example.student_course_registration.service;

import com.example.student_course_registration.entity.User;
import com.example.student_course_registration.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    // ==========================================
    // CREATE USER
    // ==========================================

    public User createUser(User user) {

        if (user.getUsername() == null ||
                user.getUsername().trim().isEmpty()) {

            throw new RuntimeException(
                    "Username is required."
            );
        }

        if (user.getPassword() == null ||
                user.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }

        if (user.getRole() == null ||
                user.getRole().trim().isEmpty()) {

            user.setRole("USER");
        }

        if (userRepository
                .findByUsername(user.getUsername().trim())
                .isPresent()) {

            throw new RuntimeException(
                    "Username already exists."
            );
        }

        user.setUsername(
                user.getUsername().trim()
        );

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // ==========================================
    // GET USER BY USERNAME
    // ==========================================

    public User getUserByUsername(
            String username) {

        return userRepository
                .findByUsername(username)
                .orElseThrow(
                        () -> new UsernameNotFoundException(
                                "User not found."
                        )
                );
    }

    // ==========================================
    // UPDATE PASSWORD
    // ==========================================

    public User updatePassword(
            String username,
            String currentPassword,
            String newPassword) {

        User user = getUserByUsername(username);

        if (currentPassword == null ||
                currentPassword.trim().isEmpty()) {

            throw new RuntimeException(
                    "Current password is required."
            );
        }

        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

            throw new RuntimeException(
                    "New password is required."
            );
        }

        if (newPassword.length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters."
            );
        }

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        return userRepository.save(user);
    }
} 