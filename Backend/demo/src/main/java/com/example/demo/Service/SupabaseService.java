package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Value;
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

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String apiKey;

    @Value("${supabase.bucket-name}")
    private String bucket;

    private String getStorageApiUrl() {
        return supabaseUrl + "/storage/v1/object";
    }

    /**
     * Upload any file (image, PDF, etc.) to Supabase Storage
     *
     * @param file   the uploaded file
     * @param folder optional folder inside bucket
     * @return public URL of the uploaded file
     */
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            String objectPath = folder + "/" + filename;
            String uploadUrl = getStorageApiUrl() + "/" + bucket + "/" + objectPath;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setBearerAuth(apiKey);
            headers.set("x-upsert", "true");

            HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.PUT, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + objectPath;
            } else {
                throw new RuntimeException("Upload failed: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Supabase file upload failed", e);
        }
    }

    /**
     * Upload PDF file specifically with content-type `application/pdf`
     */
    public String uploadPdf(String fileName, byte[] fileBytes) {
        String objectPath = bucket + "/" + fileName;
        String uploadUrl = getStorageApiUrl() + "/" + objectPath;

        try {
            URL url = new URL(uploadUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("PUT");
            connection.setRequestProperty("apikey", apiKey);
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            connection.setRequestProperty("Content-Type", "application/pdf");
            connection.setRequestProperty("x-upsert", "true");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(fileBytes);
                os.flush();
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == 200 || responseCode == 201) {
                return supabaseUrl + "/storage/v1/object/public/" + objectPath;
            } else {
                throw new RuntimeException("Upload failed: " + responseCode + " - " + connection.getResponseMessage());
            }
        } catch (Exception e) {
            throw new RuntimeException("Supabase PDF upload failed", e);
        }
    }
}
