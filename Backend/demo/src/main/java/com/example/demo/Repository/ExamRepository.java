package com.example.demo.Repository;
import java.util.List;
import java.util.UUID;
import com.example.demo.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID> {
    List<Exam> findByStatus(String status);
    
}