package com.example.demo.Service;


import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.model.SalesMan;

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

    public SalesMan registerSalesMan(SalesMan salesMan) throws Exception {
        if (salesManRepository.existsByEmail(salesMan.getEmail())) {
            throw new Exception("Email already registered");
        }

        salesMan.setPassword(passwordEncoder.encode(salesMan.getPassword()));
        return salesManRepository.save(salesMan);
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


