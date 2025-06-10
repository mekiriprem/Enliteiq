package com.example.demo.Service;


import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.model.SalesMan;

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
}


