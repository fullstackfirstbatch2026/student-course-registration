package com.example.student_course_registration.repository;

import com.example.student_course_registration.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    // Find course by course code
    Optional<Course> findByCourseCode(String courseCode);

    // Check whether a course code already exists
    boolean existsByCourseCode(String courseCode);


    // =========================================================
    // SUBQUERY
    // Find courses having registrations above the
    // average registration count
    // =========================================================

    @Query(value = """
            SELECT c.*
            FROM courses c
            WHERE (
                SELECT COUNT(*)
                FROM registrations r
                WHERE r.course_id = c.id
            ) > (
                SELECT AVG(course_count)
                FROM (
                    SELECT COUNT(*) AS course_count
                    FROM registrations
                    GROUP BY course_id
                ) counts
            )
            """, nativeQuery = true)
    List<Course> findCoursesAboveAverageRegistrationCount();
}