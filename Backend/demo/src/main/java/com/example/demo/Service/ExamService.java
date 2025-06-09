package com.example.demo.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Repository.ExamRepository;
import com.example.demo.model.Exam;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Optional<Exam> getExamById(UUID id) {
        return examRepository.findById(id);
    }

    @Transactional
    public Exam saveExam(Exam exam) {
        return examRepository.save(exam);
    }

    @Transactional
    public Exam updateExam(UUID id, Exam exam) {
        if (!examRepository.existsById(id)) {
            throw new IllegalArgumentException("Exam not found with id: " + id);
        }
        exam.setId(id);
        return examRepository.save(exam);
    }

    @Transactional
    public void deleteExam(UUID id) {
        if (!examRepository.existsById(id)) {
            throw new IllegalArgumentException("Exam not found with id: " + id);
        }
        examRepository.deleteById(id);
    }
}
