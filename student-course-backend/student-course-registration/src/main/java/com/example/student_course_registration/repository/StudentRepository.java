
package com.example.student_course_registration.repository;

import com.example.student_course_registration.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);
}


//  findAll()
// findById()
// save()
// deleteById()
// count()


//JpaRepository