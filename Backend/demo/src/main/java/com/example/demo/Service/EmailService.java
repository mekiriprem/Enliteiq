package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendContactMessage(String name, String email, String subject, String messageBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("your-receiving-email@gmail.com"); // Your email to receive messages
        message.setSubject("Contact Us Form: " + subject);
        message.setText("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + messageBody);
        mailSender.send(message);
    }
}

