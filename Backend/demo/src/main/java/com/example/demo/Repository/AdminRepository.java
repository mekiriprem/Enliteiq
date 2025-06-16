package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Admin;
import com.example.demo.model.SalesMan;

public interface AdminRepository  extends JpaRepository<Admin, Integer>{
    Admin findByEmail(String email);
  

}
