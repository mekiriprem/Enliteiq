package com.example.demo.controller;


import com.example.demo.Service.CoordinatorService;
import com.example.demo.model.Coordinator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coordinators")
//@CrossOrigin(origins = "http://localhost:5173") // frontend port
public class CoordinatorController {

    @Autowired
    private CoordinatorService coordinatorService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCoordinator(@RequestBody Coordinator coordinator) {
        try {
            Coordinator savedCoordinator = coordinatorService.registerCoordinator(coordinator);
            return new ResponseEntity<>(savedCoordinator, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
