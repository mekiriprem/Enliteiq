package com.example.demo.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Blog;

public interface BlogRepository  extends JpaRepository<Blog, UUID>{
    Optional<Blog> findBySlug(String slug);

}
