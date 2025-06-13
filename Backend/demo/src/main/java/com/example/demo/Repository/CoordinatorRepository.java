package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Coordinator;

public interface CoordinatorRepository extends JpaRepository<Coordinator, Long> {
    boolean existsByEmail(String email);

}
