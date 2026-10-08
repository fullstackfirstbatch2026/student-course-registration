
package com.example.student_course_registration.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "registrations",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"student_id", "course_id"}
        )
    }
)
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private LocalDate registrationDate;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    public Registration() {
    }

    public Registration(Student student, Course course,
                       LocalDate registrationDate, String status) {
        this.student = student;
        this.course = course;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
