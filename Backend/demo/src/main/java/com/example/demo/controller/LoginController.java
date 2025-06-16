package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Repository.AdminRepository;
import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.SalesManDTO;
import com.example.demo.model.Admin;
import com.example.demo.model.SalesMan;
import com.example.demo.model.User;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired private SalesManRepository salesManRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String emailOrPhone = (request.getEmail() != null && !request.getEmail().isEmpty())
                ? request.getEmail()
                : request.getPhone();
        String password = request.getPassword();

        // 1. Check SalesMan (by email only)
        SalesMan sm = salesManRepository.findByEmail(emailOrPhone);
        if (sm != null && "active".equalsIgnoreCase(sm.getStatus()) && passwordEncoder.matches(password, sm.getPassword())) {
            LoginResponse res = new LoginResponse();
            res.setRole("salesman");

            SalesManDTO dto = new SalesManDTO();
            dto.setId(sm.getId());
            dto.setName(sm.getName());
            dto.setEmail(sm.getEmail());

            res.setData(dto);
            return ResponseEntity.ok(res);
        }

        // 2. Check Admin (by email only)
        Admin admin = adminRepository.findByEmail(emailOrPhone);
        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            LoginResponse res = new LoginResponse();
            res.setRole("admin");
            res.setData(admin);
            return ResponseEntity.ok(res);
        }        // 3. Check User (by email or phone)
        User user = null;
        
        // First try to find by phone
        user = userRepository.findByPhone(emailOrPhone);
        
        // If not found by phone, try to find by email
        if (user == null) {
            List<User> usersByEmail = userRepository.findByEmail(emailOrPhone);
            if (!usersByEmail.isEmpty()) {
                user = usersByEmail.get(0); // Take the first user if multiple found
            }
        }

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            LoginResponse res = new LoginResponse();
            res.setRole("user");
            res.setData(user);
            return ResponseEntity.ok(res);
        }

        // ❌ If no match
        return ResponseEntity.status(401).body("Invalid credentials");
    }

}