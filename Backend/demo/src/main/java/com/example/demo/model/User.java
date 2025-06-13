package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // internal DB id

    @Column(unique = true)
    private String userId; // e.g. user1, user2, etc.

    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    private String school;

    @Column(name = "class")
    private String userClass; // 'class' is reserved, so we use userClass

    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-userExams") // use named reference
    private List<UserExam> userExams = new ArrayList<>();

    @ManyToMany
    @JsonIgnore // prevent circular reference
    @JoinTable(
        name = "user_registered_exams",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "exam_id")
    )
    private List<Exam> registeredExams = new ArrayList<>();

    public User() {}

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getUserClass() {
        return userClass;
    }

    public void setUserClass(String userClass) {
        this.userClass = userClass;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<UserExam> getUserExams() {
        return userExams;
    }

    public void setUserExams(List<UserExam> userExams) {
        this.userExams = userExams;
    }

    public List<Exam> getRegisteredExams() {
        return registeredExams;
    }

    public void setRegisteredExams(List<Exam> registeredExams) {
        this.registeredExams = registeredExams;
    }
}
