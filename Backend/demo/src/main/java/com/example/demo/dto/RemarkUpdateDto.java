package com.example.demo.dto;



import lombok.Data;

@Data
public class RemarkUpdateDto {
    private String role; // "salesman" or "admin"
    private String name; // Either salesman name or admin name
    private String remark;
}

