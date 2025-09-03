package com.kanban.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "columns")
public class BoardColumn {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @jakarta.persistence.Column(unique = true, nullable = false)
    private String columnId;
    
    @jakarta.persistence.Column(nullable = false)
    private String title;
    
    @jakarta.persistence.Column(name = "display_order")
    private Integer displayOrder;
    
    @jakarta.persistence.Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @jakarta.persistence.Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Construtores
    public BoardColumn() {}
    
    public BoardColumn(String columnId, String title, Integer displayOrder) {
        this.columnId = columnId;
        this.title = title;
        this.displayOrder = displayOrder;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getColumnId() {
        return columnId;
    }
    
    public void setColumnId(String columnId) {
        this.columnId = columnId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
