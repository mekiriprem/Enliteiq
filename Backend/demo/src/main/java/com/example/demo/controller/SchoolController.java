package com.example.demo.controller;

import com.example.demo.model.School;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.Service.SchoolService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;
    
    @Autowired 
    private SchoolRepository  schoolRepository;

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
//    @PutMapping("/{schoolRegistrationId}")
//    public ResponseEntity<?> updateSchool(
//            @PathVariable Long schoolRegistrationId,
//            @RequestBody School school) {
//        try {
//            School updatedSchool = schoolService.updateSchool(schoolRegistrationId, school);
//            return ResponseEntity.ok(updatedSchool);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    
    @PutMapping("/toggle-status/{id}")
    public ResponseEntity<?> toggleSchoolStatus(@PathVariable Long id) {
        Optional<School> optionalSchool = schoolRepository.findById(id);
        if (optionalSchool.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("School not found");
        }

        School school = optionalSchool.get();
        String currentStatus = school.getStatus();
        school.setStatus(currentStatus.equalsIgnoreCase("active") ? "inactive" : "active");
        schoolRepository.save(school);

        return ResponseEntity.ok(Map.of(
            "message", "Status updated successfully",
            "newStatus", school.getStatus()
        ));
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
    
    @GetMapping("/active")
    public ResponseEntity<List<School>> getActiveSchools() {
        List<School> activeSchools = schoolRepository.findByStatus("active");
        return ResponseEntity.ok(activeSchools);
    }
}
