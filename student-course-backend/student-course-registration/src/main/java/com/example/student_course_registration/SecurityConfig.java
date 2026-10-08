package com.example.student_course_registration;

import com.example.student_course_registration.service.CustomUserDetailsService;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService) {

        this.userDetailsService = userDetailsService;
    }

    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==========================================
    // AUTHENTICATION PROVIDER
    // ==========================================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }

    // ==========================================
    // AUTHENTICATION MANAGER
    // ==========================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // ==========================================
    // CORS
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                // ==================================
                // CSRF
                // ==================================

                .csrf(csrf -> csrf.disable())

                // ==================================
                // CORS
                // ==================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // ==================================
                // AUTHORIZATION
                // ==================================

                .authorizeHttpRequests(auth -> auth

                        // ----------------------------------
                        // PUBLIC AUTH ENDPOINTS
                        // ----------------------------------

                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/logout",
                                "/api/auth/register"
                        )
                        .permitAll()

                        // ----------------------------------
                        // LOGGED-IN USER PROFILE
                        // ----------------------------------

                        .requestMatchers(
                                "/api/users/me",
                                "/api/users/me/password"
                        )
                        .authenticated()

                        // ----------------------------------
                        // ADMIN ONLY USER CREATION
                        // ----------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/users"
                        )
                        .hasRole("ADMIN")

                        // ----------------------------------
                        // OTHER USER ADMINISTRATION
                        // ----------------------------------

                        .requestMatchers(
                                "/api/users/**"
                        )
                        .hasRole("ADMIN")

                        // ----------------------------------
                        // STUDENTS
                        // ----------------------------------

                        .requestMatchers(
                                "/api/students/**"
                        )
                        .authenticated()

                        // ----------------------------------
                        // COURSES
                        // ----------------------------------

                        .requestMatchers(
                                "/api/courses/**"
                        )
                        .authenticated()

                        // ----------------------------------
                        // FACULTY
                        // ----------------------------------

                        .requestMatchers(
                                "/api/faculty/**"
                        )
                        .authenticated()

                        // ----------------------------------
                        // REGISTRATIONS
                        // ----------------------------------

                        .requestMatchers(
                                "/api/registrations/**"
                        )
                        .authenticated()

                        // ----------------------------------
                        // EVERYTHING ELSE
                        // ----------------------------------

                        .anyRequest()
                        .authenticated()
                );

        return http.build();
    }
}