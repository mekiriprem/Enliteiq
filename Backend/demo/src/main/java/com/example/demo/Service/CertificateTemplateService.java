package com.example.demo.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.demo.Repository.UserExamRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.CertificateRequest;
import com.example.demo.model.Exam;
import com.example.demo.model.User;
import com.example.demo.model.UserExam;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

@Service
public class CertificateTemplateService {

    private final String supabaseUrl;
    private final String supabaseKey;
    private final String bucket;
    private final TemplateEngine templateEngine;
    private final UserRepository userRepository;
    @Autowired
    private  UserExamRepository userExamRepository;
    @Autowired
    private com.example.demo.Repository.ExamRepository ExamRepository;

    @Autowired
    public CertificateTemplateService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.key}") String supabaseKey,
            @Value("${supabase.bucket}") String bucket,
            TemplateEngine templateEngine,
            UserRepository userRepository) {
        this.supabaseUrl = supabaseUrl.endsWith("/") ? supabaseUrl.substring(0, supabaseUrl.length() - 1) : supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.bucket = bucket;
        this.templateEngine = templateEngine;
        this.userRepository = userRepository;
    }

    public byte[] generatePdf(CertificateRequest cert) throws IOException {
        try {
            User user = userRepository.findById(cert.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + cert.getUserId()));

            Context context = new Context();
            context.setVariable("name", user.getName());
            context.setVariable("email", user.getEmail());
            context.setVariable("phone", user.getPhone());
            context.setVariable("percentage", cert.getPercentage());
            context.setVariable("subject", cert.getSubject());
            context.setVariable("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));

            String template = cert.getTemplateName();
            if (template == null || template.isBlank()) {
                throw new IllegalArgumentException("Template name is missing in request");
            }

            List<String> allowedTemplates = List.of("template1", "template2", "template3");
            if (!allowedTemplates.contains(template)) {
                throw new IllegalArgumentException("Invalid template name: " + template);
            }

            String htmlContent = templateEngine.process(template, context);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.useFastMode();
            builder.run();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new IOException("Error generating PDF: " + e.getMessage(), e);
        }
    }

    public void uploadToSupabase(byte[] pdfBytes, String subject, String studentName) throws IOException, InterruptedException {
        String safeStudentName = studentName.trim().replaceAll("[^a-zA-Z0-9_-]", "_");
        String safeSubject = subject.trim().replaceAll("[^a-zA-Z0-9_-]", "_");

        String filePath = "certificates/" + safeStudentName + "/" + safeSubject + ".pdf";

        // Construct full URL carefully (avoid double slashes)
        String url = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filePath;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .header("Content-Type", "application/pdf")
                .PUT(HttpRequest.BodyPublishers.ofByteArray(pdfBytes))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            throw new IOException("Failed to upload PDF. Status: " + response.statusCode() + ", Response: " + response.body());
        }
    }

    
    public void processCertificates(List<CertificateRequest> certificates) throws IOException, InterruptedException {
        for (CertificateRequest cert : certificates) {
            
            if (cert.getUserId() == null) {
                throw new IllegalArgumentException("User ID is null in certificate request: " + cert);
            }

            if (cert.getExamId() == null) {
                throw new IllegalArgumentException("Exam ID is null in certificate request: " + cert);
            }
            User user = userRepository.findById(cert.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + cert.getUserId()));

            Exam exam = ExamRepository.findById(cert.getExamId())
                    .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + cert.getExamId()));

            // Save UserExam entry
            UserExam userExam = new UserExam(user, exam);
            try {
                double percentage = Double.parseDouble(cert.getPercentage());
                userExam.setPercentage(percentage);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid percentage value: " + cert.getPercentage());
            }

            userExamRepository.save(userExam); // persist UserExam

            byte[] pdfBytes = generatePdf(cert);

            uploadToSupabase(pdfBytes, cert.getSubject(), user.getName());
        }
    }
}
