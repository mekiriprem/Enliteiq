package com.example.demo.Service;

import com.example.demo.model.School;
import com.example.demo.Repository.SchoolRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public School registerSchool(School school) throws Exception {
        // Check if email already exists
        if (schoolRepository.existsBySchoolEmail(school.getSchoolEmail())) {
            throw new Exception("School email already registered");
        }

        // Encrypt password
        school.setPassword(passwordEncoder.encode(school.getPassword()));

        // Save to Supabase via Spring Data JPA
        School savedSchool = schoolRepository.save(school);

        return savedSchool;
    }

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public School updateSchool(Long schoolRegistrationId, School school) throws Exception {
        Optional<School> existingSchoolOpt = schoolRepository.findById(schoolRegistrationId);
        if (!existingSchoolOpt.isPresent()) {
            throw new Exception("School not found with ID: " + schoolRegistrationId);
        }

        School existingSchool = existingSchoolOpt.get();

        // Check if the new email is already used by another school
        if (!school.getSchoolEmail().equals(existingSchool.getSchoolEmail()) &&
            schoolRepository.existsBySchoolEmail(school.getSchoolEmail())) {
            throw new Exception("School email already registered");
        }

        // Update fields
        existingSchool.setSchoolName(school.getSchoolName());
        existingSchool.setSchoolAddress(school.getSchoolAddress());
        existingSchool.setSchoolEmail(school.getSchoolEmail());
        existingSchool.setSchoolAdminName(school.getSchoolAdminName());
        existingSchool.setStatus(school.getStatus()); // Update status

        // Update password only if provided
        if (school.getPassword() != null && !school.getPassword().isEmpty()) {
            existingSchool.setPassword(passwordEncoder.encode(school.getPassword()));
        }

        // Save updated school
        return schoolRepository.save(existingSchool);
    }

    public void deleteSchool(Long schoolRegistrationId) throws Exception {
        if (!schoolRepository.existsById(schoolRegistrationId)) {
            throw new Exception("School not found with ID: " + schoolRegistrationId);
        }
        schoolRepository.deleteById(schoolRegistrationId);
    }
}