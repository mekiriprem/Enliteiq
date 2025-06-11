package com.example.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class QuestionDto {
    private Long id;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
}

