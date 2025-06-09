package com.example.demo.dto;

import lombok.Data;

@Data
public class UserExamResultDTO {
    private String examTitle;
    private String subject;
    private String date;
    private String time;
    private Double percentage; // can be null
    private String certificateUrl; // can be null
}

