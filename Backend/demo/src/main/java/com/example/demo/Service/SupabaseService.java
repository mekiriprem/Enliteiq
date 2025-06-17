package com.example.demo.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

@Service
public class SupabaseService {

    private static final String SUPABASE_BUCKET = "uploads";
    private static final String SUPABASE_PROJECT_ID = "umizvvtljajrvrbzdpzi"; // Only project ID
    private static final String API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaXp2dnRsamFqcnZyYnpkcHppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTAxNjI3OSwiZXhwIjoyMDY0NTkyMjc5fQ.16B7k1iM64z2_npyfKT3ryC0jjaDfNDgvbFa_qpDwMw";

    private static final String BASE_URL = "https://" + SUPABASE_PROJECT_ID + ".supabase.co";
    private static final String STORAGE_API_URL = BASE_URL + "/storage/v1/object";

    /**
     * Upload a PDF file to Supabase Storage
     */
    public String uploadPdf(String fileName, byte[] fileBytes) {
        String objectPath = SUPABASE_BUCKET + "/" + fileName;
        String uploadUrl = STORAGE_API_URL + "/" + objectPath;

        try {
            URL url = new URL(uploadUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("PUT"); // PUT is idempotent and preferred
            connection.setRequestProperty("apikey", API_KEY);
            connection.setRequestProperty("Authorization", "Bearer " + API_KEY);
            connection.setRequestProperty("Content-Type", "application/pdf");
            connection.setRequestProperty("x-upsert", "true");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(fileBytes);
                os.flush();
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == 200 || responseCode == 201) {
                return BASE_URL + "/storage/v1/object/public/" + objectPath;
            } else {
                throw new RuntimeException("Upload failed: " + responseCode + " - " + connection.getResponseMessage());
            }
        } catch (Exception e) {
            throw new RuntimeException("Supabase PDF upload failed", e);
        }
    }

    /**
     * Upload a file (image or any type) to Supabase Storage
     */
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            String objectPath = folder + "/" + filename;
            String uploadUrl = STORAGE_API_URL + "/" + objectPath;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setBearerAuth(API_KEY);
            headers.set("x-upsert", "true");

            HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.PUT, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return BASE_URL + "/storage/v1/object/public/" + objectPath;
            } else {
                throw new RuntimeException("Upload failed: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Supabase file upload failed", e);
        }
    }
}
