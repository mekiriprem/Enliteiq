package com.example.demo.Repository;


import com.example.demo.model.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Integer salesmanId);
}

