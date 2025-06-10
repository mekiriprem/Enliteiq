package com.example.demo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.UserService;
import com.example.demo.dto.UserDTO;
import com.example.demo.dto.UserExamResultDTO;
import com.example.demo.model.Admin;
import com.example.demo.model.User;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private  UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin user) {
        try {
            String result = userService.registerAdmin(user);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            // Log the actual error for debugging, don't expose it directly to the client
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to register admin. Please try again later.");
        }
    }

//
//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
//        try {
//            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
//        }
//    }
    
  


        @PostMapping("/user/{userId}/exam/{examId}")
        public ResponseEntity<String> registerUserToExam(
                @PathVariable Long userId,
                @PathVariable UUID examId) {
            userService.registerUserToExam(userId, examId);
            return ResponseEntity.ok("User registered to exam successfully.");
        }
        
        @GetMapping("/getallUsers")
        public ResponseEntity<List<UserDTO>> getAllUsers() {
            return ResponseEntity.ok(userService.getAllUsers());
        }

        @GetMapping("/{userId}")
        public ResponseEntity<UserDTO> getUserByUserId(@PathVariable Long userId) {
            return ResponseEntity.ok(userService.getUserByUserId(userId));
        }
        
        @GetMapping("/users/{id}/exam-results")
        public ResponseEntity<List<UserExamResultDTO>> getUserExamResults(@PathVariable Long id) {
            List<UserExamResultDTO> results = userService.getUserExamResults(id);
            return ResponseEntity.ok(results);
        }



    // Inner class for login request data transfer object (DTO)
    private static class LoginRequest {
        private String email;
        private String password;

        // Getters and setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}