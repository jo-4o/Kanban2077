package com.kanban.service;

import com.kanban.model.Task;
import com.kanban.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    public List<Task> getAllTasks() {
        return taskRepository.findAllOrderByStatusAndPriority();
    }
    
    public List<Task> getTasksByStatus(Task.Status status) {
        return taskRepository.findByStatusOrderByPriorityAndCreatedAt(status);
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public Task createTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(Task.Status.TODO);
        }
        // Se columnId foi definido, usar esse valor
        if (task.getColumnId() != null && !task.getColumnId().isEmpty()) {
            // Manter o columnId fornecido
        } else {
            // Se columnId não foi definido, usar o status como padrão
            task.setColumnId(task.getStatus().name().toLowerCase());
        }
        return taskRepository.save(task);
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setAssignee(taskDetails.getAssignee());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            
            // Atualizar columnId se fornecido
            if (taskDetails.getColumnId() != null) {
                task.setColumnId(taskDetails.getColumnId());
            }
            
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Tarefa não encontrada com id: " + id);
        }
    }
    
    public Task updateTaskStatus(Long id, Task.Status newStatus) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(newStatus);
            // Atualizar columnId para corresponder ao novo status
            task.setColumnId(newStatus.name().toLowerCase());
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Tarefa não encontrada com id: " + id);
        }
    }
    
    public void deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        } else {
            throw new RuntimeException("Tarefa não encontrada com id: " + id);
        }
    }
    
    public long countTasksByStatus(Task.Status status) {
        return taskRepository.countByStatus(status);
    }
    
    public List<Task> getTasksByAssignee(String assignee) {
        return taskRepository.findByAssignee(assignee);
    }
    
    public List<Task> getTasksByColumnId(String columnId) {
        return taskRepository.findByColumnIdOrderByCreatedAt(columnId);
    }
    
    public long countTasksByColumnId(String columnId) {
        return taskRepository.countByColumnId(columnId);
    }
    
    public Task moveTaskToColumn(Long taskId, String columnId) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setColumnId(columnId);
            // Atualizar status baseado no columnId se for uma das colunas padrão
            if ("todo".equals(columnId)) {
                task.setStatus(Task.Status.TODO);
            } else if ("doing".equals(columnId)) {
                task.setStatus(Task.Status.DOING);
            } else if ("done".equals(columnId)) {
                task.setStatus(Task.Status.DONE);
            }
            // Para colunas customizadas, manter o status atual
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Tarefa não encontrada com id: " + taskId);
        }
    }
}
