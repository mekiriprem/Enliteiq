package com.example.demo.controller;

import com.example.demo.Service.CertificateTemplateService;
import com.example.demo.dto.CertificateRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.ui.Model;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/templates")
public class CertificateTemplateController {

    private final CertificateTemplateService service;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.bucket}")
    private String bucket;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Autowired
    public CertificateTemplateController(CertificateTemplateService service) {
        this.service = service;
    }

    public static class ApiResponse {
        private String status;
        private String message;

        public ApiResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @PostMapping(value = "/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> generateAndUploadCertificates(@RequestBody List<CertificateRequest> requests) {
        try {
            if (requests == null || requests.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("error", "Request body is empty or invalid"));
            }

            service.processCertificates(requests);

            return ResponseEntity.ok(
                    new ApiResponse("success", "Generated and uploaded " + requests.size() + " certificates")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Invalid input: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // For backend debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Internal server error: " + e.getMessage()));
        }
    }

    // Preview Template (used in Thymeleaf view rendering, not API response)
    @GetMapping(value = "/preview/{templateName}", produces = MediaType.TEXT_HTML_VALUE)
    public String previewTemplate(@PathVariable String templateName, Model model) throws IOException {
        // Replace placeholders in the file manually if needed
        ClassPathResource resource = new ClassPathResource("templates/" + templateName + ".html");

        if (!resource.exists()) {
            return "<h2>Template not found: " + templateName + "</h2>";
        }

        String html = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

        // Optional: Replace placeholders like {{name}}, {{email}}, etc.
        html = html.replace("{{name}}", "John Doe")
                   .replace("{{email}}", "john@example.com")
                   .replace("{{phone}}", "1234567890")
                   .replace("{{percentage}}", "95%")
                   .replace("{{subject}}", "Mathematics")
                   .replace("{{date}}", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));

        return html;
    }
    // ✅ Get certificates by student name
    @GetMapping("/certificates/student/{studentName}")
    public ResponseEntity<List<String>> getCertificatesByStudent(@PathVariable String studentName) throws IOException, InterruptedException {
        String path = "certificates/" + studentName + "/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/list/" + bucket + "?prefix=" + path))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return ResponseEntity.status(response.statusCode()).body(List.of("Error: " + response.body()));
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> files = objectMapper.readValue(response.body(), List.class);

        List<String> urls = files.stream()
                .map(file -> {
                    String fileName = (String) file.get("name");
                    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                })
                .toList();

        return ResponseEntity.ok(urls);
    }

    // ✅ Get certificates by subject name
    @GetMapping("/certificates/subject/{subjectName}")
    public ResponseEntity<List<String>> getCertificatesBySubject(@PathVariable String subjectName) throws IOException, InterruptedException {
        String path = "certificates/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/list/" + bucket + "?prefix=" + path))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return ResponseEntity.status(response.statusCode()).body(List.of("Error: " + response.body()));
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> files = objectMapper.readValue(response.body(), List.class);

        List<String> urls = files.stream()
                .filter(file -> ((String) file.get("name")).endsWith("/" + subjectName + ".pdf"))
                .map(file -> {
                    String fullPath = (String) file.get("name");
                    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fullPath;
                })
                .toList();

        return ResponseEntity.ok(urls);
    }

    // ✅ Get all certificates
    @GetMapping("/certificates/all")
    public ResponseEntity<List<String>> getAllCertificates() throws IOException, InterruptedException {
        String path = "certificates/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/list/" + bucket + "?prefix=" + path))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return ResponseEntity.status(response.statusCode()).body(List.of("Error: " + response.body()));
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> files = objectMapper.readValue(response.body(), List.class);

        List<String> urls = files.stream()
                .filter(file -> ((String) file.get("name")).endsWith(".pdf"))
                .map(file -> {
                    String fullPath = (String) file.get("name");
                    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fullPath;
                })
                .toList();

        return ResponseEntity.ok(urls);
    }
    
//    @GetMapping(value = "/preview/{templateName}", produces = MediaType.APPLICATION_PDF_VALUE)
//    public ResponseEntity<byte[]> previewTemplateAsPdf(@PathVariable String templateName) throws IOException {
//        ClassPathResource resource = new ClassPathResource("templates/" + templateName + ".html");
//
//        if (!resource.exists()) {
//            String errorHtml = "<h2>Template not found: " + templateName + "</h2>";
//            return ResponseEntity.status(404)
//                    .contentType(MediaType.TEXT_HTML)
//                    .body(errorHtml.getBytes(StandardCharsets.UTF_8));
//        }
//
//        String html = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
//
//        html = html.replace("{{name}}", "John Doe")
//                   .replace("{{email}}", "john@example.com")
//                   .replace("{{phone}}", "1234567890")
//                   .replace("{{percentage}}", "95%")
//                   .replace("{{subject}}", "Mathematics")
//                   .replace("{{date}}", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
//
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//        PdfRendererBuilder builder = new PdfRendererBuilder();
//        builder.withHtmlContent(html, null);
//        builder.toStream(outputStream);
//        builder.run();
//
//        byte[] pdfBytes = outputStream.toByteArray();
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=certificate.pdf")
//                .contentType(MediaType.APPLICATION_PDF)
//                .body(pdfBytes);
//    }

}
