package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDTO {
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String school;
    private String userClass;

    private List<ExamSummaryDTO> registeredExams;
}

