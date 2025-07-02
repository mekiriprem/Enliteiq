package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Service.EmailService;
import com.example.demo.dto.ContactFormDto;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public String sendContactMessage(@RequestBody ContactFormDto dto) {
        emailService.sendContactMessage(dto.getName(), dto.getEmail(), dto.getSubject(), dto.getMessage());
        return "Message sent successfully";
    }
}
