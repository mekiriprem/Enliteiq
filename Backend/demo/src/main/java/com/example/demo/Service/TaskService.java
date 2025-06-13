package com.example.demo.Service;



import com.example.demo.model.SalesMan;
import com.example.demo.model.Task;
import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SalesManRepository salesManRepository;

    public Task createTask(Task task, int salesManId) {
        Optional<SalesMan> optionalSalesMan = salesManRepository.findById(salesManId);
        if (optionalSalesMan.isPresent()) {
            task.setAssignedTo(optionalSalesMan.get());
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("SalesMan with ID " + salesManId + " not found.");
        }
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}

