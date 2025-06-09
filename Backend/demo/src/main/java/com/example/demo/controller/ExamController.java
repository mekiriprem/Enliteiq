package com.example.demo.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Repository.ExamRepository;
import com.example.demo.Service.ExamService;
import com.example.demo.model.Exam;

@RestController

@RequestMapping("/api")
public class ExamController {

    @Autowired
    private ExamService examService;
    
    @Autowired
    private ExamRepository ExamRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String supabaseApiKey;

    @Value("${supabase.bucket-name}")
    private String bucketName;

    // 🔵 Get all exams
    @GetMapping("/exams")
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }
    

    @GetMapping("/exams/{id}")
    public ResponseEntity<?> getExamById(@PathVariable UUID id) {
        return examService.getExamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔵 Add exam
    @PostMapping(value = "/exams", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Exam> addExam(@RequestBody Exam exam) {
        Exam savedExam = examService.saveExam(exam);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExam);
    }

    // 🔵 Update exam
    @PutMapping("/exams/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable UUID id, @RequestBody Exam exam) {
        try {
            Exam updatedExam = examService.updateExam(id, exam);
            return ResponseEntity.ok(updatedExam);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 🔵 Delete exam
    @DeleteMapping("/exams/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable UUID id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }

    // 🔵 Upload image to Supabase Storage bucket
    @PostMapping("/upload/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String fileType = file.getContentType();

            if (!List.of("image/jpeg", "image/jpg", "image/png").contains(fileType)) {
                return ResponseEntity.badRequest().body("Invalid file type.");
            }

            // Generate unique file name
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

            // Supabase Storage upload URL
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

            // Create HTTP client
            HttpClient client = HttpClient.newHttpClient();

            // Build HTTP PUT request with file bytes and necessary headers
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("apikey", supabaseApiKey)
                    .header("Authorization", "Bearer " + supabaseApiKey)
                    .header("Content-Type", fileType)
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            // Send request and get response
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                // Construct public URL assuming bucket is public
                String imageUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
                return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
            } else {
                return ResponseEntity.status(response.statusCode())
                        .body(Map.of("error", "Upload failed: " + response.body()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image to Supabase"));
        }
    }
    
    @PostMapping("/recommend")
    public ResponseEntity<String> recommendExam(@RequestParam UUID examId) {
        // Step 1: Reset all "recommended" statuses
        List<Exam> recommendedExams = ExamRepository.findByStatus("recommended");
        for (Exam exam : recommendedExams) {
            exam.setStatus(null);
        }

        // Step 2: Set the target exam as recommended
        Optional<Exam> targetExamOpt = ExamRepository.findById(examId);
        if (targetExamOpt.isPresent()) {
            Exam targetExam = targetExamOpt.get();
            targetExam.setStatus("recommended");

            // Save all changes at once
            recommendedExams.add(targetExam);
            ExamRepository.saveAll(recommendedExams);

            return ResponseEntity.ok("Exam recommended successfully.");
        } else {
            return ResponseEntity.badRequest().body("Exam not found for ID: " + examId);
        }
    }
    
}