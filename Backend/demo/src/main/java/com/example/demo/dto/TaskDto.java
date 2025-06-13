package com.example.demo.dto;

import lombok.Data;

@Data
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String dueDate; // we'll format LocalDate as string
    private String priority;
    private String remarks;
    private SalesmanDto assignedTo;

    @Data
    public static class SalesmanDto {
        private Integer id;
        private String name;
        private String email;
        private String status;
    }
}
