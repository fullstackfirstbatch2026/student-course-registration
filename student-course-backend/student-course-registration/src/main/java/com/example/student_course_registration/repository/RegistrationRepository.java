package com.example.student_course_registration.repository;

import com.example.student_course_registration.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    // Check whether a student is already registered
    // for a particular course with a particular status.
    boolean existsByStudent_IdAndCourse_IdAndStatus(
            Long studentId,
            Long courseId,
            String status);

    // Find all registrations of one student.
    List<Registration> findByStudent_Id(Long studentId);

    // Find all registrations for one course.
    List<Registration> findByCourse_Id(Long courseId);

    // Count registrations of a student by status.
    long countByStudent_IdAndStatus(
            Long studentId,
            String status);


    // =========================================================
    // JOIN QUERY
    // Display Student + Course + Faculty information
    // =========================================================

    @Query(value = """
            SELECT
                s.name AS student_name,
                c.course_name AS course_name,
                f.name AS faculty_name,
                r.registration_date AS registration_date,
                r.status AS status
            FROM registrations r
            INNER JOIN students s
                ON r.student_id = s.id
            INNER JOIN courses c
                ON r.course_id = c.id
            INNER JOIN faculty f
                ON c.faculty_id = f.id
            """, nativeQuery = true)
    List<Object[]> findRegisteredStudentsWithCourseAndFaculty();
}