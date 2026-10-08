package com.example.student_course_registration.controller;

import com.example.student_course_registration.entity.Course;
import com.example.student_course_registration.service.CourseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // ==========================================
    // GET ALL COURSES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {

        return ResponseEntity.ok(
                courseService.getAllCourses()
        );
    }

    // ==========================================
    // SUBQUERY
    // Courses above average registration count
    // ==========================================

    @GetMapping("/above-average-registrations")
    public ResponseEntity<List<Course>> getCoursesAboveAverageRegistrationCount() {

        return ResponseEntity.ok(
                courseService.getCoursesAboveAverageRegistrationCount()
        );
    }

    // ==========================================
    // GET COURSE BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    courseService.getCourseById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // CREATE COURSE
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createCourse(
            @RequestBody Course course) {

        try {

            Course createdCourse =
                    courseService.createCourse(course);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdCourse);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // UPDATE COURSE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestBody Course course) {

        try {

            Course updatedCourse =
                    courseService.updateCourse(
                            id,
                            course
                    );

            return ResponseEntity.ok(
                    updatedCourse
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // DELETE COURSE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id) {

        try {

            courseService.deleteCourse(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }
}