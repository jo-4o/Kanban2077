// ...existing code...
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from './task.service';
import { ColumnService, ColumnDto } from './column.service';

export interface Task {
  id?: number;
  title: string;
  description: string;
  assignee: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  createdAt?: Date;
  updatedAt?: Date;
  columnId?: string; // ID da coluna onde a tarefa está
}

export interface Column {
  id: string;
  title: string;
  dbId?: number; // ID do banco de dados
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('projeto');

  columns: Column[] = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'doing', title: 'Em Progresso' },
    { id: 'done', title: 'Concluído' }
  ];

  tasks: Task[] = [];
  loading = false;
  error: string | null = null;

  showAddTaskModal = false;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    assignee: '',
    priority: 'media',
    status: 'todo',
    dueDate: '',
    columnId: 'todo' // Coluna padrão
  };

  showAddColumnModal = false;
  newColumnTitle = '';

  // Context menu properties
  showColumnContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedColumn: Column | null = null;

  // Edit column modal properties
  showEditColumnModal = false;
  editingColumnTitle = '';
  editingColumnId = '';

  constructor(private taskService: TaskService, private columnService: ColumnService) {}

  ngOnInit() {
    this.loadColumns();
    this.loadTasks();
    // Cursor trail listener
    window.addEventListener('pointermove', this.handlePointerMove);
    // Ocasional spawn de partícula
    window.addEventListener('pointermove', this.spawnParticleThrottled);
  }

  private handlePointerMove = (e: PointerEvent) => {
    document.body.style.setProperty('--cx', e.clientX + 'px');
    document.body.style.setProperty('--cy', e.clientY + 'px');
  };

  private lastParticleTime = 0;
  private spawnParticleThrottled = (e: PointerEvent) => {
    const now = performance.now();
    if (now - this.lastParticleTime < 90) return; // limita frequência
    this.lastParticleTime = now;
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  };

  loadColumns() {
    this.columnService.getAllColumns().subscribe({
      next: (columns) => {
        this.columns = columns.map(col => ({
          id: col.columnId,
          title: col.title,
          dbId: col.id
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar colunas:', error);
        // Fallback para colunas padrão se houver erro
        this.columns = [
          { id: 'todo', title: 'A Fazer' },
          { id: 'doing', title: 'Em Progresso' },
          { id: 'done', title: 'Concluído' }
        ];
      }
    });
  }

  loadTasks() {
    this.loading = true;
    this.error = null;
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        // Converter os dados do backend para o formato do frontend
        this.tasks = tasks.map(task => ({
          ...task,
          priority: task.priority.toLowerCase() as 'baixa' | 'media' | 'alta',
          status: task.status.toLowerCase() as 'todo' | 'doing' | 'done',
          columnId: task.columnId || task.status.toLowerCase() // Fallback para compatibilidade
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.error = 'Erro ao carregar tarefas. Verifique se o backend está rodando.';
        this.loading = false;
        
        // Fallback para dados de exemplo se houver erro
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    this.tasks = [
      {
        id: 1,
        title: 'Criar componente de login',
        description: 'Desenvolver tela de autenticação de usuários',
        assignee: 'João',
        priority: 'alta',
        status: 'todo',
        dueDate: '2025-08-30',
        createdAt: new Date()
      },
      {
        id: 2,
        title: 'Configurar banco de dados',
        description: 'Setup do MySQL com Spring Boot',
        assignee: 'Maria',
        priority: 'media',
        status: 'doing',
        dueDate: '2025-08-28',
        createdAt: new Date()
      },
      {
        id: 3,
        title: 'Documentação da API',
        description: 'Criar documentação completa dos endpoints',
        assignee: 'Pedro',
        priority: 'baixa',
        status: 'done',
        dueDate: '2025-08-27',
        createdAt: new Date()
      }
    ];
  }

  openAddTaskModal() {
    this.showAddTaskModal = true;
    this.newTask = {
      title: '',
      description: '',
      assignee: '',
      priority: 'media',
      status: 'todo',
      dueDate: '',
      columnId: this.columns.length > 0 ? this.columns[0].id : 'todo'
    };
  }

  closeAddTaskModal() {
    this.showAddTaskModal = false;
  }

  addTask() {
    if (this.newTask.title) {
      this.loading = true;
      
      // Preparar dados para envio (sempre usar TODO como status padrão para novas tarefas)
      const taskToSend: Partial<Task> = {
        ...this.newTask,
        status: 'todo' // Sempre criar como TODO no frontend
      };
      
      this.taskService.createTask(taskToSend).subscribe({
        next: (task) => {
          // Converter o formato do backend para frontend
          const newTask: Task = {
            ...task,
            priority: task.priority.toLowerCase() as 'baixa' | 'media' | 'alta',
            status: task.status.toLowerCase() as 'todo' | 'doing' | 'done',
            columnId: task.columnId || task.status.toLowerCase()
          };
          
          this.tasks.push(newTask);
          this.closeAddTaskModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          this.error = 'Erro ao criar tarefa. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  openAddColumnModal() {
    this.showAddColumnModal = true;
    this.newColumnTitle = '';
  }

  closeAddColumnModal() {
    this.showAddColumnModal = false;
  }

  addColumn() {
    if (this.newColumnTitle.trim()) {
      // Gera um id único baseado no nome
      const columnId = this.newColumnTitle.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      
      const newColumn = {
        columnId: columnId,
        title: this.newColumnTitle.trim()
      };
      
      this.columnService.createColumn(newColumn).subscribe({
        next: (column) => {
          this.columns.push({ 
            id: column.columnId, 
            title: column.title,
            dbId: column.id 
          });
          this.closeAddColumnModal();
        },
        error: (error) => {
          console.error('Erro ao criar coluna:', error);
          this.error = 'Erro ao criar quadro. Já existe um quadro com esse nome.';
        }
      });
    }
  }

  openColumnContextMenu(event: MouseEvent, column: Column) {
    event.preventDefault(); // Previne o menu padrão do navegador
    event.stopPropagation();
    
    this.selectedColumn = column;
    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.showColumnContextMenu = true;

    // Fechar o menu ao clicar em qualquer lugar
    setTimeout(() => {
      document.addEventListener('click', this.closeColumnContextMenu);
    }, 0);
  }

  closeColumnContextMenu = () => {
    this.showColumnContextMenu = false;
    this.selectedColumn = null;
    document.removeEventListener('click', this.closeColumnContextMenu);
  }

  editColumn() {
    if (this.selectedColumn) {
      this.editingColumnId = this.selectedColumn.id;
      this.editingColumnTitle = this.selectedColumn.title;
      this.showEditColumnModal = true;
      this.closeColumnContextMenu();
    }
  }

  updateColumn() {
    if (this.editingColumnTitle.trim() && this.editingColumnId) {
      const column = this.columns.find(col => col.id === this.editingColumnId);
      if (!column || !column.dbId) {
        this.error = 'Erro: coluna não encontrada.';
        return;
      }

      const updatedColumn = {
        columnId: this.editingColumnId,
        title: this.editingColumnTitle.trim()
      };

      this.columnService.updateColumn(column.dbId, updatedColumn).subscribe({
        next: (updatedCol) => {
          const index = this.columns.findIndex(col => col.id === this.editingColumnId);
          if (index !== -1) {
            this.columns[index].title = updatedCol.title;
          }
          this.showEditColumnModal = false;
          this.editingColumnTitle = '';
          this.editingColumnId = '';
        },
        error: (error) => {
          console.error('Erro ao atualizar coluna:', error);
          this.error = 'Erro ao atualizar quadro. Tente novamente.';
        }
      });
    }
  }

  deleteColumn() {
    if (this.selectedColumn && this.selectedColumn.dbId && confirm(`Deseja excluir o quadro "${this.selectedColumn.title}"?`)) {
      this.columnService.deleteColumn(this.selectedColumn.dbId).subscribe({
        next: () => {
          this.columns = this.columns.filter(col => col.id !== this.selectedColumn!.id);
          
          // Move todas as tarefas da coluna deletada para "A Fazer"
          this.tasks.forEach(task => {
            if (task.status === this.selectedColumn!.id) {
              task.status = 'todo';
              if (task.id) {
                this.taskService.updateTaskStatus(task.id, 'todo').subscribe();
              }
            }
          });
          
          this.closeColumnContextMenu();
        },
        error: (error) => {
          console.error('Erro ao excluir coluna:', error);
          this.error = 'Erro ao excluir quadro. Tente novamente.';
        }
      });
    }
  }

  duplicateColumn() {
    if (this.selectedColumn) {
      const newColumnTitle = `${this.selectedColumn.title} - Cópia`;
      const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      
      const newColumn = {
        columnId: columnId,
        title: newColumnTitle
      };
      
      this.columnService.createColumn(newColumn).subscribe({
        next: (column) => {
          this.columns.push({ 
            id: column.columnId, 
            title: column.title,
            dbId: column.id 
          });
          this.closeColumnContextMenu();
        },
        error: (error) => {
          console.error('Erro ao duplicar coluna:', error);
          this.error = 'Erro ao duplicar quadro. Tente novamente.';
        }
      });
    }
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.tasks.filter(task => (task.columnId || task.status) === columnId);
  }

  getTaskCount(columnId: string): number {
    return this.getTasksByColumn(columnId).length;
  }

  getConnectedColumns(currentColumnId: string): string[] {
    return this.columns
      .filter(col => col.id !== currentColumnId)
      .map(col => 'column-' + col.id);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newColumnId = this.getColumnIdFromContainer(event.container.id);
      
      // Atualizar no backend usando o novo endpoint para mover para coluna
      if (task.id) {
        this.taskService.moveTaskToColumn(task.id, newColumnId).subscribe({
          next: (updatedTask) => {
            // Atualizar localmente após sucesso no backend
            task.status = updatedTask.status.toLowerCase() as 'todo' | 'doing' | 'done';
            task.columnId = updatedTask.columnId;
            
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
          },
          error: (error) => {
            console.error('Erro ao mover tarefa:', error);
            this.error = 'Erro ao mover tarefa. Tente novamente.';
            // Reverter a operação visual se der erro
            this.loadTasks();
          }
        });
      } else {
        // Fallback para modo offline
        task.columnId = newColumnId;
        // Mapear para status válido se for coluna padrão
        if (newColumnId === 'todo') task.status = 'todo';
        else if (newColumnId === 'doing') task.status = 'doing';
        else if (newColumnId === 'done') task.status = 'done';
        
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  dropColumn(event: CdkDragDrop<Column[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    
    // Sincronizar a nova ordem com o backend
    const orderedColumnIds = this.columns.map(col => col.id);
    this.columnService.reorderColumns(orderedColumnIds).subscribe({
      next: () => {
        console.log('Ordem das colunas atualizada no backend');
      },
      error: (error) => {
        console.error('Erro ao reordenar colunas:', error);
        this.error = 'Erro ao reordenar quadros.';
      }
    });
  }

  private getColumnIdFromContainer(containerId: string): string {
    // Extrai o ID da coluna do container ID do CDK (formato: "column-todo")
    return containerId.replace('column-', '') || 'todo';
  }

  openTaskMenu(task: Task) {
    // Implementar menu de contexto (editar, excluir, etc.)
    const action = confirm(`Deseja excluir a tarefa "${task.title}"?`);
    
    if (action && task.id) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
          this.error = 'Erro ao excluir tarefa. Tente novamente.';
        }
      });
    }
  }

  dismissError() {
    this.error = null;
  }

  animateCloseError(event: Event) {
    event.stopPropagation();
    const container = (event.currentTarget as HTMLElement).closest('.error-message');
    if (!container) { this.dismissError(); return; }
    container.classList.add('closing');
    const remove = () => {
      container.removeEventListener('animationend', remove);
      this.dismissError();
    };
    container.addEventListener('animationend', remove);
  }
}
