package com.example.demo.dto;

import lombok.Data;

@Data
public class ContactFormDto {
    private String name;
    private String email;
    private String subject;
    private String message;

    // Getters and Setters
}
