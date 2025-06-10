package com.example.demo.Service;


import com.example.demo.Repository.AdminRepository;
import com.example.demo.Repository.ExamRepository;
import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.model.SalesMan;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SalesManService {

    @Autowired
    private SalesManRepository salesManRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Transactional
    public SalesMan registerSalesMan(SalesMan salesMan) throws Exception {
        // Validate input
        if (salesMan == null || salesMan.getEmail() == null) {
            throw new IllegalArgumentException("SalesMan or email cannot be null");
        }

        String email = salesMan.getEmail();

        // Check if email already exists in any repository
        boolean emailExists = 
                salesManRepository.existsByEmail(email) ||
                userRepository.existsByEmail(email) ||
                schoolRepository.existsBySchoolEmail(email) || 
                adminRepository.findByEmail(email) != null;

        if (emailExists) {
            throw new Exception("Email already registered");
        }

        // Encrypt password
        salesMan.setPassword(passwordEncoder.encode(salesMan.getPassword()));

        // Save to repository via Spring Data JPA
        SalesMan savedSalesMan = salesManRepository.save(salesMan);

        return savedSalesMan;
    }
    
    public List<SalesMan> getAllSalesmen() {
        return salesManRepository.findAll();
    }
    
    
    public SalesMan updateStatus(int id, String status) throws Exception {
        Optional<SalesMan> optionalSalesMan = salesManRepository.findById(id);
        if (optionalSalesMan.isEmpty()) {
            throw new Exception("SalesMan not found with ID: " + id);
        }

        SalesMan salesMan = optionalSalesMan.get();
        salesMan.setStatus(status);
        return salesManRepository.save(salesMan);
    }
}


