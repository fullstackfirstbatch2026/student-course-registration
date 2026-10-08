package com.example.student_course_registration.service;

import com.example.student_course_registration.entity.Course;
import com.example.student_course_registration.repository.CourseRepository;
import com.example.student_course_registration.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final RegistrationRepository registrationRepository;

    public CourseService(
            CourseRepository courseRepository,
            RegistrationRepository registrationRepository) {

        this.courseRepository = courseRepository;
        this.registrationRepository = registrationRepository;
    }


    // ==========================================
    // GET ALL COURSES
    // ==========================================

    public List<Course> getAllCourses() {

        return courseRepository.findAll();
    }


    // ==========================================
    // GET COURSE BY ID
    // ==========================================

    public Course getCourseById(Long id) {

        return courseRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Course not found")
                );
    }


    // ==========================================
    // SUBQUERY
    // Find courses having registrations
    // above the average registration count
    // ==========================================

    public List<Course> getCoursesAboveAverageRegistrationCount() {

        return courseRepository
                .findCoursesAboveAverageRegistrationCount();
    }


    // ==========================================
    // CREATE COURSE
    // ==========================================

    public Course createCourse(Course course) {

        return courseRepository.save(course);
    }


    // ==========================================
    // UPDATE COURSE
    // ==========================================

    public Course updateCourse(
            Long id,
            Course courseDetails) {

        Course course = getCourseById(id);

        course.setCourseCode(
                courseDetails.getCourseCode()
        );

        course.setCourseName(
                courseDetails.getCourseName()
        );

        course.setCapacity(
                courseDetails.getCapacity()
        );

        course.setAvailableSeats(
                courseDetails.getAvailableSeats()
        );

        course.setFee(
                courseDetails.getFee()
        );

        course.setFaculty(
                courseDetails.getFaculty()
        );

        return courseRepository.save(course);
    }


    // ==========================================
    // DELETE COURSE
    // ==========================================

    public void deleteCourse(Long id) {

        Course course = getCourseById(id);

        // Check whether this course has registrations
        if (!registrationRepository.findByCourse_Id(id).isEmpty()) {

            throw new RuntimeException(
                    "Cannot delete course because students are registered for this course."
            );
        }

        courseRepository.delete(course);
    }
}