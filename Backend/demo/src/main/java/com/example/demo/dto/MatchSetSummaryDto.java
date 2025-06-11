package com.example.demo.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class MatchSetSummaryDto {
    private Long id;
    private String title;
    private String subject;
    private LocalDate date;
}