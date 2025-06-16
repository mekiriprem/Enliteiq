package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExamResultDTO {
    private String studentName;
    private String certificateUrl;
    private Double percentage;
    private String examTitle;
    
    
}
