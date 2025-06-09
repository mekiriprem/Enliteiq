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
    @MapsId("userId") 
    @JsonBackReference// maps userId attribute of embedded id
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("examId") 
    @JsonBackReference// maps examId attribute of embedded id
    @JoinColumn(name = "exam_id")
    private Exam exam;

    private Double percentage;

    public UserExam() {}

    public UserExam(User user, Exam exam) {
        this.user = user;
        this.exam = exam;
        this.id = new UserExamId(user.getId(), exam.getId());
    }
}

