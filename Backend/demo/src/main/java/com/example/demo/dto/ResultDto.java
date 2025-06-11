package com.example.demo.dto;

import lombok.Data;

@Data
public class ResultDto {
    private int totalQuestions;
    private int correctAnswers;
    private int incorrectAnswers;
    private double percentage;
    private String resultStatus; // "Pass" or "Fail"
}

