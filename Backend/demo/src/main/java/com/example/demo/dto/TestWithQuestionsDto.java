package com.example.demo.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class TestWithQuestionsDto {
    private Long id;
    private String title;
    private String subject;
    private LocalDate date;
    private List<QuestionDto> questions;
    // ✅ Duration of the exam in minutes
    private Integer durationMinutes;
}

