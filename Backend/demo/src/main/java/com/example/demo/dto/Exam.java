package com.example.demo.dto;

import lombok.Data;

@Data
public class Exam {
    private String title;
    private String date;
    private String time;
    private String subject;
    private String status;
    private String description;
    private String image;

    private String registrationDeadline;
    private String eligibility;
    private String syllabus;
    private String duration;
}
