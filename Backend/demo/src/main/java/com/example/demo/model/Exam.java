package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String date;
    private String time;
    private String subject;
    @Column(name = "status", nullable = true)
    private String status;
    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    @Column(length = 500)
    private String eligibility; // e.g., "Grade 8-12 students"

    @Column(length = 255)
    private String syllabus;
    
    @Column(length = 1000)
    private String description;
    
   private String duration;

    private String image;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @JsonIgnore 
    private List<UserExam> userExams = new ArrayList<>();

    @ManyToMany(mappedBy = "registeredExams")
    @JsonIgnore
    private List<User> registeredUsers = new ArrayList<>();
}
