package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "schools")
public class School {
    @Id
    private String schoolRegistrationId;
    private String schoolName;
    private String schoolAddress;
    private String schoolEmail;
    private String schoolAdminName;
    private String password;
    private String status = "active";
}