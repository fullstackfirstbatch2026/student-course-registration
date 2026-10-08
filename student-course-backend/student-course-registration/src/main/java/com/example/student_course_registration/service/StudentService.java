package com.example.student_course_registration.service;

import com.example.student_course_registration.entity.Student;
import com.example.student_course_registration.repository.StudentRepository;
import com.example.student_course_registration.repository.RegistrationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;

    public StudentService(
            StudentRepository studentRepository,
            RegistrationRepository registrationRepository) {

        this.studentRepository = studentRepository;
        this.registrationRepository = registrationRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();  //SELECT * FROM students;
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with ID: " + id));
    }

    // Create new student
    public Student createStudent(Student student) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        return studentRepository.save(student);
    }

    // Update student
    public Student updateStudent(
            Long id,
            Student updatedStudent) {

        Student existingStudent = getStudentById(id);

        if (!existingStudent.getEmail()
                .equals(updatedStudent.getEmail())
                && studentRepository.existsByEmail(
                        updatedStudent.getEmail())) {

            throw new RuntimeException(
                    "Email already exists");
        }

        existingStudent.setName(
                updatedStudent.getName());

        existingStudent.setEmail(
                updatedStudent.getEmail());

        existingStudent.setPhone(
                updatedStudent.getPhone());

        return studentRepository.save(existingStudent);
    }

    // Delete student
    public void deleteStudent(Long id) {

        // Make sure the student exists
        Student student = getStudentById(id);

        // Check whether the student has active registrations
        long registrationCount =
                registrationRepository
                        .countByStudent_IdAndStatus(
                                id,
                                "ACTIVE");

        if (registrationCount > 0) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete student because the student has active course registrations."
            );
        }

        // Delete the student
        studentRepository.delete(student);
    }
}