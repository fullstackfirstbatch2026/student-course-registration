
package com.example.student_course_registration.repository;

import com.example.student_course_registration.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    boolean existsByEmail(String email);
}
