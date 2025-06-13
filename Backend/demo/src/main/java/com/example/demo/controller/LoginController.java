package com.example.demo.controller;

import com.example.demo.Repository.AdminRepository;
import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.SalesManDTO;
import com.example.demo.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired private SalesManRepository salesManRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // 1. Check SalesMan
        SalesMan sm = salesManRepository.findByEmail(email);
        if (sm != null && "active".equalsIgnoreCase(sm.getStatus()) && passwordEncoder.matches(password, sm.getPassword())) {
            // Build response without status field
            LoginResponse res = new LoginResponse();
            res.setRole("salesman");

            // Create a response DTO without the `status` field
            SalesManDTO dto = new SalesManDTO();
            dto.setId(sm.getId());
            dto.setName(sm.getName());
            dto.setEmail(sm.getEmail());

            res.setData(dto);
            return ResponseEntity.ok(res); // ✅ wrap in ResponseEntity
        }
        // 2. Check Admin
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            LoginResponse res = new LoginResponse();
            res.setRole("admin");
            res.setData(admin);
            return ResponseEntity.ok(res);
        }

        // 3. Check School
//        School school = schoolRepository.findByschoolEmail(email);
//        if (school != null && passwordEncoder.matches(password, school.getPassword())) {
//            LoginResponse res = new LoginResponse();
//            res.setRole("school");
//            res.setData(school);
//            return ResponseEntity.ok(res);
//        }

        // 4. Check User
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            LoginResponse res = new LoginResponse();
            res.setRole("user");
            res.setData(user);
            return ResponseEntity.ok(res);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}

