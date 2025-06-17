package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Repository.BlogRepository;
import com.example.demo.model.Blog;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    // Get all blogs
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Get a blog by ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable UUID id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get a blog by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        return blogRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new blog
    @PostMapping
    public Blog createBlog(@RequestBody Blog blog) {
        blog.setSlug(generateSlug(blog.getTitle()));
        blog.setPublishedDate(LocalDate.now());
        return blogRepository.save(blog);
    }

    // Update a blog
    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable UUID id, @RequestBody Blog updatedBlog) {
        return blogRepository.findById(id)
                .map(existingBlog -> {
                    existingBlog.setTitle(updatedBlog.getTitle());
                    existingBlog.setSlug(generateSlug(updatedBlog.getTitle()));
                    existingBlog.setExcerpt(updatedBlog.getExcerpt());
                    existingBlog.setContent(updatedBlog.getContent());
                    existingBlog.setAuthor(updatedBlog.getAuthor());
                    existingBlog.setCategory(updatedBlog.getCategory());
                    existingBlog.setTags(updatedBlog.getTags());
                    existingBlog.setImageUrl(updatedBlog.getImageUrl());
                    existingBlog.setFeatured(updatedBlog.getFeatured());
                    existingBlog.setReadTime(updatedBlog.getReadTime());

                    Blog savedBlog = blogRepository.save(existingBlog);
                    return ResponseEntity.ok(savedBlog);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Helper method to generate slug
    private String generateSlug(String title) {
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
