package com.example.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class StudentAnswerDto {
    private Long matchSetId;
    private Long studentId;
    private List<AnswerDto> answers;
}

