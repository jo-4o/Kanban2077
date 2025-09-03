package com.kanban.repository;

import com.kanban.model.Task;
import com.kanban.model.Task.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByStatus(Status status);
    
    List<Task> findByAssignee(String assignee);
    
    @Query("SELECT t FROM Task t WHERE t.status = :status ORDER BY t.priority DESC, t.createdAt ASC")
    List<Task> findByStatusOrderByPriorityAndCreatedAt(Status status);
    
    @Query("SELECT t FROM Task t ORDER BY t.status, t.priority DESC, t.createdAt ASC")
    List<Task> findAllOrderByStatusAndPriority();
    
    long countByStatus(Status status);
    
    List<Task> findByColumnIdOrderByCreatedAt(String columnId);
    
    long countByColumnId(String columnId);
}
