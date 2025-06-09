package com.example.demo.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.UserExam;
import com.example.demo.model.UserExamId;

public interface UserExamRepository extends JpaRepository<UserExam, UserExamId>{
    List<UserExam> findByExamId(UUID examId);

}
