package com.kanban.repository;

import com.kanban.model.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColumnRepository extends JpaRepository<BoardColumn, Long> {
    
    Optional<BoardColumn> findByColumnId(String columnId);
    
    @Query("SELECT c FROM BoardColumn c ORDER BY c.displayOrder ASC")
    List<BoardColumn> findAllOrderByDisplayOrder();
    
    boolean existsByColumnId(String columnId);
    
    @Query("SELECT COALESCE(MAX(c.displayOrder), 0) FROM BoardColumn c")
    Integer findMaxDisplayOrder();
}
