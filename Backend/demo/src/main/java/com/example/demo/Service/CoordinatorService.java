package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Coordinator;

import jakarta.transaction.Transactional;

@Service
public class CoordinatorService {
    @Autowired
    private com.example.demo.Repository.CoordinatorRepository coordinatorRepository;

    @Transactional
    public Coordinator registerCoordinator(Coordinator coordinator) throws Exception {
        if (coordinator == null || coordinator.getEmail() == null) {
            throw new IllegalArgumentException("Coordinator or email cannot be null");
        }

        if (coordinatorRepository.existsByEmail(coordinator.getEmail())) {
            throw new Exception("Coordinator with this email already exists");
        }

        return coordinatorRepository.save(coordinator);
    }
}