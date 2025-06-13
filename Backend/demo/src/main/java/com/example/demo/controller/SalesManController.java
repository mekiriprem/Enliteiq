package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.SalesMan;

@RestController
@RequestMapping("/api/salesman")
@CrossOrigin(origins = "*")
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
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllSalesmen() {
        List<SalesMan> salesmen = salesManService.getAllSalesmen();
        return ResponseEntity.ok(salesmen);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSalesmanStatus(
            @PathVariable int id,
            @RequestParam String status) {
        try {
            if (!status.equalsIgnoreCase("active") && !status.equalsIgnoreCase("inactive")) {
                return ResponseEntity.badRequest().body("Invalid status. Must be 'active' or 'inactive'.");
            }
            SalesMan updated = salesManService.updateStatus(id, status.toLowerCase());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}