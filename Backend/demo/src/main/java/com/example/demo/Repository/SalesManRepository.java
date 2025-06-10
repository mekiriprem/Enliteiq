package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.SalesMan;

public interface SalesManRepository extends JpaRepository<SalesMan, Integer>{
    boolean existsByEmail(String email);
    

}
