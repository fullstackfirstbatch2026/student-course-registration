package com.example.student_course_registration.controller;

import com.example.student_course_registration.entity.Registration;
import com.example.student_course_registration.service.RegistrationService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {

        this.registrationService =
                registrationService;
    }


    // ==========================================
    // GET ALL REGISTRATIONS
    // ==========================================

    @GetMapping
    public List<Registration> getAllRegistrations() {

        return registrationService
                .getAllRegistrations();
    }


    // ==========================================
    // JOIN QUERY
    // Student + Course + Faculty
    // ==========================================

    @GetMapping("/join")
    public List<Object[]> getRegisteredStudentsWithCourseAndFaculty() {

        return registrationService
                .getRegisteredStudentsWithCourseAndFaculty();
    }


    // ==========================================
    // GET REGISTRATION BY ID
    // ==========================================

    @GetMapping("/{id}")
    public Registration getRegistrationById(
            @PathVariable Long id) {

        return registrationService
                .getRegistrationById(id);
    }


    // ==========================================
    // CREATE REGISTRATION
    // ==========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Registration createRegistration(
            @RequestBody Registration registration) {

        return registrationService
                .createRegistration(registration);
    }


    // ==========================================
    // UPDATE REGISTRATION
    // ==========================================

    @PutMapping("/{id}")
    public Registration updateRegistration(
            @PathVariable Long id,
            @RequestBody Registration registration) {

        return registrationService.updateRegistration(
                id,
                registration
        );
    }


    // ==========================================
    // DELETE REGISTRATION
    // ==========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRegistration(
            @PathVariable Long id) {

        registrationService
                .deleteRegistration(id);
    }
}