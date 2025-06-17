package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Repository.BlogRepository;
import com.example.demo.Service.SupabaseService;
import com.example.demo.model.Blog;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private SupabaseService supabaseService;
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable UUID id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        return blogRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Blog> createBlog(@RequestPart("blog") String blogJson,
                                           @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Blog blog = objectMapper.readValue(blogJson, Blog.class);

            if (image != null && !image.isEmpty()) {
                String imageUrl = supabaseService.uploadFile(image, "blog-images");
                blog.setImageUrl(imageUrl);
            }

            blog.setSlug(generateSlug(blog.getTitle()));
            blog.setPublishedDate(LocalDate.now());
            return ResponseEntity.ok(blogRepository.save(blog));

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Blog> updateBlog(@PathVariable UUID id,
                                           @RequestPart("blog") String blogJson,
                                           @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Blog updatedBlog = objectMapper.readValue(blogJson, Blog.class);

            return blogRepository.findById(id)
                    .map(existingBlog -> {
                        existingBlog.setTitle(updatedBlog.getTitle());
                        existingBlog.setSlug(generateSlug(updatedBlog.getTitle()));
                        existingBlog.setExcerpt(updatedBlog.getExcerpt());
                        existingBlog.setContent(updatedBlog.getContent());
                        existingBlog.setAuthor(updatedBlog.getAuthor());
                        existingBlog.setCategory(updatedBlog.getCategory());
                        existingBlog.setTags(updatedBlog.getTags());
                        existingBlog.setFeatured(updatedBlog.getFeatured());
                        existingBlog.setReadTime(updatedBlog.getReadTime());

                        if (image != null && !image.isEmpty()) {
                            String imageUrl = supabaseService.uploadFile(image, "blog-images");
                            existingBlog.setImageUrl(imageUrl);
                        }

                        return ResponseEntity.ok(blogRepository.save(existingBlog));
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    private String generateSlug(String title) {
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}

