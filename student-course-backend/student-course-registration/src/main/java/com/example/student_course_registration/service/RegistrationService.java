package com.example.student_course_registration.service;

import com.example.student_course_registration.entity.Course;
import com.example.student_course_registration.entity.Registration;
import com.example.student_course_registration.entity.Student;
import com.example.student_course_registration.repository.CourseRepository;
import com.example.student_course_registration.repository.RegistrationRepository;
import com.example.student_course_registration.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.registrationRepository = registrationRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    // ==========================================
    // GET ALL REGISTRATIONS
    // ==========================================

    public List<Registration> getAllRegistrations() {

        return registrationRepository.findAll();
    }


    // ==========================================
    // JOIN QUERY
    // Student + Course + Faculty
    // ==========================================

    public List<Object[]> getRegisteredStudentsWithCourseAndFaculty() {

        return registrationRepository
                .findRegisteredStudentsWithCourseAndFaculty();
    }


    // ==========================================
    // GET REGISTRATION BY ID
    // ==========================================

    public Registration getRegistrationById(Long id) {

        return registrationRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Registration not found"
                        )
                );
    }


    // ==========================================
    // CREATE REGISTRATION
    // ==========================================

    @Transactional
    public Registration createRegistration(
            Registration registration) {

        if (registration.getStudent() == null ||
                registration.getStudent().getId() == null) {

            throw new RuntimeException(
                    "Student is required."
            );
        }

        if (registration.getCourse() == null ||
                registration.getCourse().getId() == null) {

            throw new RuntimeException(
                    "Course is required."
            );
        }

        Long studentId =
                registration.getStudent().getId();

        Long courseId =
                registration.getCourse().getId();


        // ==========================================
        // CHECK STUDENT
        // ==========================================

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found"
                                )
                        );


        // ==========================================
        // CHECK COURSE
        // ==========================================

        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Course not found"
                                )
                        );


        // ==========================================
        // DEFAULT STATUS = ACTIVE
        // ==========================================

        String status =
                registration.getStatus();

        if (status == null ||
                status.trim().isEmpty()) {

            status = "ACTIVE";
            registration.setStatus(status);
        }


        // ==========================================
        // ACTIVE REGISTRATION
        // ==========================================

        if ("ACTIVE".equalsIgnoreCase(status)) {

            // Prevent duplicate ACTIVE registration

            boolean alreadyRegistered =
                    registrationRepository
                            .existsByStudent_IdAndCourse_IdAndStatus(
                                    studentId,
                                    courseId,
                                    "ACTIVE"
                            );

            if (alreadyRegistered) {

                throw new RuntimeException(
                        "Student is already registered for this course."
                );
            }


            // Check available seats

            if (course.getAvailableSeats() == null ||
                    course.getAvailableSeats() <= 0) {

                throw new RuntimeException(
                        "No available seats."
                );
            }


            // Decrease available seats

            course.setAvailableSeats(
                    course.getAvailableSeats() - 1
            );

            courseRepository.save(course);
        }


        // ==========================================
        // USE REAL DATABASE ENTITIES
        // ==========================================

        registration.setStudent(student);
        registration.setCourse(course);


        // ==========================================
        // SAVE REGISTRATION
        // ==========================================

        return registrationRepository.save(
                registration
        );
    }


    // ==========================================
    // UPDATE REGISTRATION
    // ==========================================

    @Transactional
    public Registration updateRegistration(
            Long id,
            Registration registrationDetails) {

        Registration registration =
                getRegistrationById(id);

        String oldStatus =
                registration.getStatus();

        String newStatus =
                registrationDetails.getStatus();

        if (newStatus == null ||
                newStatus.trim().isEmpty()) {

            newStatus = oldStatus;
        }


        // ==========================================
        // ACTIVE -> CANCELLED
        // ==========================================

        if ("ACTIVE".equalsIgnoreCase(oldStatus) &&
                "CANCELLED".equalsIgnoreCase(newStatus)) {

            Course course =
                    courseRepository.findById(
                            registration
                                    .getCourse()
                                    .getId()
                    )
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Course not found"
                            )
                    );

            if (course.getAvailableSeats() == null) {
                course.setAvailableSeats(0);
            }

            course.setAvailableSeats(
                    course.getAvailableSeats() + 1
            );

            if (course.getCapacity() != null &&
                    course.getAvailableSeats() >
                            course.getCapacity()) {

                course.setAvailableSeats(
                        course.getCapacity()
                );
            }

            courseRepository.save(course);
        }


        // ==========================================
        // CANCELLED -> ACTIVE
        // ==========================================

        if ("CANCELLED".equalsIgnoreCase(oldStatus) &&
                "ACTIVE".equalsIgnoreCase(newStatus)) {

            Long studentId =
                    registration
                            .getStudent()
                            .getId();

            Long courseId =
                    registration
                            .getCourse()
                            .getId();


            // Prevent duplicate ACTIVE registration

            boolean alreadyRegistered =
                    registrationRepository
                            .existsByStudent_IdAndCourse_IdAndStatus(
                                    studentId,
                                    courseId,
                                    "ACTIVE"
                            );

            if (alreadyRegistered) {

                throw new RuntimeException(
                        "Student is already registered for this course."
                );
            }


            // Check course

            Course course =
                    courseRepository.findById(courseId)
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Course not found"
                                    )
                            );


            // Check seats

            if (course.getAvailableSeats() == null ||
                    course.getAvailableSeats() <= 0) {

                throw new RuntimeException(
                        "No available seats."
                );
            }


            // Decrease seat

            course.setAvailableSeats(
                    course.getAvailableSeats() - 1
            );

            courseRepository.save(course);
        }


        // ==========================================
        // UPDATE REGISTRATION DATE
        // ==========================================

        registration.setRegistrationDate(
                registrationDetails
                        .getRegistrationDate()
        );


        // ==========================================
        // UPDATE STATUS
        // ==========================================

        registration.setStatus(newStatus);


        return registrationRepository.save(
                registration
        );
    }


    // ==========================================
    // DELETE / CANCEL REGISTRATION
    // ==========================================

    @Transactional
    public void deleteRegistration(Long id) {

        Registration registration =
                getRegistrationById(id);


        // ==========================================
        // IF ACTIVE, RELEASE THE SEAT
        // ==========================================

        if ("ACTIVE".equalsIgnoreCase(
                registration.getStatus())) {

            Course course =
                    courseRepository.findById(
                            registration
                                    .getCourse()
                                    .getId()
                    )
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Course not found"
                            )
                    );

            if (course.getAvailableSeats() == null) {
                course.setAvailableSeats(0);
            }

            course.setAvailableSeats(
                    course.getAvailableSeats() + 1
            );

            if (course.getCapacity() != null &&
                    course.getAvailableSeats() >
                            course.getCapacity()) {

                course.setAvailableSeats(
                        course.getCapacity()
                );
            }

            courseRepository.save(course);
        }


        // ==========================================
        // DELETE REGISTRATION
        // ==========================================

        registrationRepository.delete(
                registration
        );
    }
}