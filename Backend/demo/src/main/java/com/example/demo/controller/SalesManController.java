package com.example.demo.controller;


import com.example.demo.model.SalesMan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salesman")
public class SalesManController {

    @Autowired
    private com.example.demo.Service.SalesManService salesManService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SalesMan salesMan) {
        try {
            SalesMan registered = salesManService.registerSalesMan(salesMan);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}