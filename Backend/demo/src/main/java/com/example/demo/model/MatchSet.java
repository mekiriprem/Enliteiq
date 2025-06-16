package com.example.demo.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class MatchSet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String subject;
    private LocalDate date;
    // ✅ Duration of the exam in minutes
    private Integer durationMinutes;
    
    private String image;

    @OneToMany(mappedBy = "matchSet", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Question> questions = new ArrayList<>();
}
