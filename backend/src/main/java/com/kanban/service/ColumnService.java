package com.kanban.service;

import com.kanban.model.BoardColumn;
import com.kanban.repository.ColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColumnService {
    
    @Autowired
    private ColumnRepository columnRepository;
    
    public List<BoardColumn> getAllColumns() {
        return columnRepository.findAllOrderByDisplayOrder();
    }
    
    public Optional<BoardColumn> getColumnById(Long id) {
        return columnRepository.findById(id);
    }
    
    public Optional<BoardColumn> getColumnByColumnId(String columnId) {
        return columnRepository.findByColumnId(columnId);
    }
    
    public BoardColumn createColumn(BoardColumn column) {
        // Verificar se já existe uma coluna com esse columnId
        if (columnRepository.existsByColumnId(column.getColumnId())) {
            throw new RuntimeException("Já existe uma coluna com esse ID: " + column.getColumnId());
        }
        
        // Se não foi especificada uma ordem, colocar no final
        if (column.getDisplayOrder() == null) {
            Integer maxOrder = columnRepository.findMaxDisplayOrder();
            column.setDisplayOrder(maxOrder + 1);
        }
        
        return columnRepository.save(column);
    }
    
    public BoardColumn updateColumn(Long id, BoardColumn columnDetails) {
        Optional<BoardColumn> optionalColumn = columnRepository.findById(id);
        if (optionalColumn.isPresent()) {
            BoardColumn column = optionalColumn.get();
            column.setTitle(columnDetails.getTitle());
            if (columnDetails.getDisplayOrder() != null) {
                column.setDisplayOrder(columnDetails.getDisplayOrder());
            }
            return columnRepository.save(column);
        }
        throw new RuntimeException("Coluna não encontrada com id: " + id);
    }
    
    public void deleteColumn(Long id) {
        if (columnRepository.existsById(id)) {
            columnRepository.deleteById(id);
        } else {
            throw new RuntimeException("Coluna não encontrada com id: " + id);
        }
    }
    
    public void reorderColumns(List<String> orderedColumnIds) {
        for (int i = 0; i < orderedColumnIds.size(); i++) {
            String columnId = orderedColumnIds.get(i);
            Optional<BoardColumn> optionalColumn = columnRepository.findByColumnId(columnId);
            if (optionalColumn.isPresent()) {
                BoardColumn column = optionalColumn.get();
                column.setDisplayOrder(i + 1);
                columnRepository.save(column);
            }
        }
    }
    
    public void initializeDefaultColumns() {
        // Verificar se já existem colunas
        if (columnRepository.count() == 0) {
            // Criar as colunas padrão
            BoardColumn todoColumn = new BoardColumn("todo", "A Fazer", 1);
            BoardColumn doingColumn = new BoardColumn("doing", "Em Progresso", 2);
            BoardColumn doneColumn = new BoardColumn("done", "Concluído", 3);
            
            columnRepository.save(todoColumn);
            columnRepository.save(doingColumn);
            columnRepository.save(doneColumn);
        }
    }
}
