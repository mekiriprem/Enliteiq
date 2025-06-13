package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_exam")
@Data
public class UserExam {

    @EmbeddedId
    private UserExamId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId") // Maps to id.userId
    @JsonBackReference("user-userExams")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("examId") // Maps to id.examId
    @JsonBackReference
    private Exam exam;

    private Double percentage;

    public UserExam() {}

    public UserExam(User user, Exam exam) {
        this.user = user;
        this.exam = exam;
        this.id = new UserExamId(user.getId(), exam.getId());
    }
}
