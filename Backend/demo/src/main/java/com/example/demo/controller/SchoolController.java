package com.example.demo.controller;

import com.example.demo.model.School;
import com.example.demo.Service.SchoolService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    @PostMapping("/register")
    public ResponseEntity<?> registerSchool(@RequestBody School school) {
        try {
            School registeredSchool = schoolService.registerSchool(school);
            return ResponseEntity.ok(registeredSchool);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        List<School> schools = schoolService.getAllSchools();
        return ResponseEntity.ok(schools);
    }
    @PutMapping("/{schoolRegistrationId}")
    public ResponseEntity<?> updateSchool(
            @PathVariable Long schoolRegistrationId,
            @RequestBody School school) {
        try {
            School updatedSchool = schoolService.updateSchool(schoolRegistrationId, school);
            return ResponseEntity.ok(updatedSchool);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{schoolRegistrationId}")
    public ResponseEntity<?> deleteSchool(@PathVariable Long schoolRegistrationId) {
        try {
            schoolService.deleteSchool(schoolRegistrationId);
            return ResponseEntity.ok().body("School deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
