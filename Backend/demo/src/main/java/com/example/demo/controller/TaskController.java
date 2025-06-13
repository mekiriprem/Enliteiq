package com.example.demo.controller;


import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Repository.TaskRepository;
import com.example.demo.Service.TaskService;
import com.example.demo.dto.RemarkUpdateDto;
import com.example.demo.dto.TaskDto;
import com.example.demo.model.Task;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;
    
    @Autowired
    private TaskRepository taskRepository;

    @PostMapping("/assign/{salesManId}")
    public Task assignTask(@RequestBody Task task, @PathVariable int salesManId) {
        return taskService.createTask(task, salesManId);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    @GetMapping("/bysalesman/{salesmanId}")
    public ResponseEntity<List<TaskDto>> getTasksBySalesmanId(@PathVariable Integer salesmanId) {
        List<Task> tasks = taskRepository.findByAssignedToId(salesmanId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        List<TaskDto> dtos = tasks.stream().map(task -> {
            TaskDto dto = new TaskDto();
            dto.setId(task.getId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setDueDate(task.getDueDate().format(formatter));
            dto.setPriority(task.getPriority());
            dto.setRemarks(task.getRemarks());

            TaskDto.SalesmanDto sm = new TaskDto.SalesmanDto();
            sm.setId(task.getAssignedTo().getId());
            sm.setName(task.getAssignedTo().getName());
            sm.setEmail(task.getAssignedTo().getEmail());
            sm.setStatus(task.getAssignedTo().getStatus());

            dto.setAssignedTo(sm);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
      @PatchMapping("/{taskId}/remark")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> updateRemark(
            @PathVariable Long taskId,
            @RequestBody RemarkUpdateDto dto
    ) {
        return taskRepository.findById(taskId).map(task -> {
            String actor = dto.getRole().equalsIgnoreCase("salesman") ? "Salesman" : "Admin";
            String formattedRemark = actor + " " + dto.getName() + ": " + dto.getRemark();
            task.setRemarks(formattedRemark);
            taskRepository.save(task);
            return ResponseEntity.ok("Remark updated successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }

}
