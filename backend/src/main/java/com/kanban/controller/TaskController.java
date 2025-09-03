package com.kanban.controller;

import com.kanban.model.Task;
import com.kanban.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable Task.Status status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Task updatedTask = taskService.updateTaskStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/count/{status}")
    public ResponseEntity<Long> countTasksByStatus(@PathVariable Task.Status status) {
        long count = taskService.countTasksByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/assignee/{assignee}")
    public ResponseEntity<List<Task>> getTasksByAssignee(@PathVariable String assignee) {
        List<Task> tasks = taskService.getTasksByAssignee(assignee);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/column/{columnId}")
    public ResponseEntity<List<Task>> getTasksByColumnId(@PathVariable String columnId) {
        List<Task> tasks = taskService.getTasksByColumnId(columnId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/count/column/{columnId}")
    public ResponseEntity<Long> countTasksByColumnId(@PathVariable String columnId) {
        long count = taskService.countTasksByColumnId(columnId);
        return ResponseEntity.ok(count);
    }
    
    @PatchMapping("/{id}/move-to-column/{columnId}")
    public ResponseEntity<Task> moveTaskToColumn(@PathVariable Long id, @PathVariable String columnId) {
        try {
            Task updatedTask = taskService.moveTaskToColumn(id, columnId);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Classe auxiliar para atualização de status
    public static class StatusUpdateRequest {
        private Task.Status status;
        
        public Task.Status getStatus() {
            return status;
        }
        
        public void setStatus(Task.Status status) {
            this.status = status;
        }
    }
}
