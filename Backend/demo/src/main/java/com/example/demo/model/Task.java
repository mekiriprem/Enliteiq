package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate dueDate;

    private String priority;
    @Column(length = 1000)
    private String remarks;// e.g. Low, Medium, High

    @ManyToOne
    @JoinColumn(name = "salesman_id")
    private SalesMan assignedTo;
}
