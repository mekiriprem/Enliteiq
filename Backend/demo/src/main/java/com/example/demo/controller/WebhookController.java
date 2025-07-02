package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    @PostMapping
    public String handleWebhook() {
        try {
            ProcessBuilder pb = new ProcessBuilder("/bin/bash", "/root/Enliteiq/Backend/demo/deploy.sh");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            return "Deployment triggered";
        } catch (IOException e) {
            e.printStackTrace();
            return "Deployment failed: " + e.getMessage();
        }
    }
}

