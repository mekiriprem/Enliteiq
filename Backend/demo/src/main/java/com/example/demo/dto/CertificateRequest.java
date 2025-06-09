package com.example.demo.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class CertificateRequest {
   
      
        private String percentage;
        private String subject;
        private Long userId;
        private String templateName;
        private UUID ExamId;

        // getters and setters
   


}
