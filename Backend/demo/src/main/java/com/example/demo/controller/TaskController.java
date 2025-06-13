package com.example.demo.controller;


import com.example.demo.Service.TaskService;
import com.example.demo.model.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/assign/{salesManId}")
    public Task assignTask(@RequestBody Task task, @PathVariable int salesManId) {
        return taskService.createTask(task, salesManId);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
}
