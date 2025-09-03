package com.kanban.controller;

import com.kanban.model.BoardColumn;
import com.kanban.service.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/columns")
@CrossOrigin(origins = "http://localhost:4200")
public class ColumnController {
    
    @Autowired
    private ColumnService columnService;
    
    @GetMapping
    public List<BoardColumn> getAllColumns() {
        return columnService.getAllColumns();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BoardColumn> getColumnById(@PathVariable Long id) {
        Optional<BoardColumn> column = columnService.getColumnById(id);
        return column.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<BoardColumn> createColumn(@RequestBody BoardColumn column) {
        try {
            BoardColumn savedColumn = columnService.createColumn(column);
            return ResponseEntity.ok(savedColumn);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BoardColumn> updateColumn(@PathVariable Long id, @RequestBody BoardColumn columnDetails) {
        try {
            BoardColumn updatedColumn = columnService.updateColumn(id, columnDetails);
            return ResponseEntity.ok(updatedColumn);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        try {
            columnService.deleteColumn(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderColumns(@RequestBody Map<String, List<String>> request) {
        List<String> orderedColumnIds = request.get("columnIds");
        if (orderedColumnIds != null) {
            columnService.reorderColumns(orderedColumnIds);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    
    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeDefaultColumns() {
        columnService.initializeDefaultColumns();
        return ResponseEntity.ok().build();
    }
}
