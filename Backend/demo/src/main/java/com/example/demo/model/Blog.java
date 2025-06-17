package com.example.demo.model;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String slug;

    @Column(columnDefinition = "TEXT") // For large text
    private String content;

    private String excerpt;
    private String author;
    private String category;

    @ElementCollection
    private List<String> tags;

    private String imageUrl;
    private Boolean featured;
    private String readTime;

    private LocalDate publishedDate;
}

