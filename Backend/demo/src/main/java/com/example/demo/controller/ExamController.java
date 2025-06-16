package com.example.demo.controller;

import java.net.URI;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
import com.example.demo.Repository.UserExamRepository;
import com.example.demo.Service.ExamService;
import com.example.demo.dto.ExamResultDTO;
import com.example.demo.model.Exam;
import com.example.demo.model.UserExam;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserExamRepository userExamRepository;

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

    // 🔵 Get exam by ID
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

    // 🔵 Upload image to Supabase Storage
    @PostMapping("/upload/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String fileType = file.getContentType();
            if (!List.of("image/jpeg", "image/jpg", "image/png").contains(fileType)) {
                return ResponseEntity.badRequest().body("Invalid file type.");
            }

            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("apikey", supabaseApiKey)
                    .header("Authorization", "Bearer " + supabaseApiKey)
                    .header("Content-Type", fileType)
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
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

    // 🔵 Toggle recommended status
    @PostMapping("/recommend")
    public ResponseEntity<String> toggleRecommendation(@RequestParam UUID examId) {
        Optional<Exam> targetExamOpt = examRepository.findById(examId);

        if (targetExamOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Exam not found for ID: " + examId);
        }

        Exam exam = targetExamOpt.get();
        if ("recommended".equalsIgnoreCase(exam.getStatus())) {
            exam.setStatus(null);
        } else {
            exam.setStatus("recommended");
        }

        examRepository.save(exam);
        return ResponseEntity.ok("Exam status updated to: " + exam.getStatus());
    }

    // 🔵 Get all recommended exams
    @GetMapping("/recommended")
    public ResponseEntity<List<Exam>> getRecommendedExams() {
        List<Exam> recommendedExams = examRepository.findByStatus("recommended");
        return ResponseEntity.ok(recommendedExams);
    }

    // 🔵 Get results of students for an exam (with certificates)
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<ExamResultDTO>> getResultsByExam(@PathVariable UUID examId) {
        List<UserExam> userExams = userExamRepository.findByExamId(examId);

        List<ExamResultDTO> results = userExams.stream().map(ue -> {
            String studentName = ue.getUser().getName();
            String examTitle = ue.getExam().getTitle();
            String subject = ue.getExam().getSubject();

            // Sanitize file path for Supabase
            String safeStudentName = studentName.trim().replaceAll("[^a-zA-Z0-9_-]", "_");
            String safeSubject = subject.trim().replaceAll("[^a-zA-Z0-9_-]", "_");

            String filePath = "certificates/" + safeStudentName + "/" + safeSubject + ".pdf";
            String certUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + filePath;

            return new ExamResultDTO(studentName, certUrl, ue.getPercentage(), examTitle);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
    @PostMapping("/{id}/pdf")
    public ResponseEntity<String> uploadExamSyllabusPdf(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        try {
            // Supabase config
            String bucket = bucketName; // your bucket name
            String projectUrl = supabaseUrl;
            String apiKey = supabaseApiKey;

            String originalFileName = URLEncoder.encode(file.getOriginalFilename(), StandardCharsets.UTF_8);
            String fileName = "syllabus_" + id + "_" + originalFileName;
            String uploadUrl = projectUrl + "/storage/v1/object/" + bucket + "/" + fileName;
            String publicUrl = projectUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;

            // Upload PDF to Supabase Storage
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", file.getContentType())
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpClient httpClient = HttpClient.newHttpClient();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                // Save URL to DB
                exam.setSyllabus(publicUrl);
                examRepository.save(exam);
                return ResponseEntity.ok("Uploaded successfully: " + publicUrl);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body("Upload failed: " + response.body());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception: " + e.getMessage());
        }
    }

}
