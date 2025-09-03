import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './app';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Listar todas as tarefas
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Buscar tarefa por ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Listar tarefas por status
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${status.toUpperCase()}`);
  }

  // Criar nova tarefa
  createTask(task: Partial<Task>): Observable<Task> {
    const taskToSend = {
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority?.toUpperCase(),
      status: 'TODO', // Sempre criar como TODO no backend
      dueDate: task.dueDate,
      columnId: task.columnId || 'todo'
    };
    
    return this.http.post<Task>(this.apiUrl, taskToSend, this.httpOptions);
  }

  // Atualizar tarefa completa
  updateTask(id: number, task: Task): Observable<Task> {
    const taskToSend = {
      ...task,
      priority: task.priority.toUpperCase(),
      status: task.status.toUpperCase()
    };
    
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskToSend, this.httpOptions);
  }

  // Atualizar apenas o status da tarefa
  updateTaskStatus(id: number, status: string): Observable<Task> {
    const statusUpdate = {
      status: status.toUpperCase()
    };
    
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, statusUpdate, this.httpOptions);
  }

  // Excluir tarefa
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Contar tarefas por status
  countTasksByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/${status.toUpperCase()}`);
  }

  // Listar tarefas por responsável
  getTasksByAssignee(assignee: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/assignee/${assignee}`);
  }
  
  // Mover tarefa para uma coluna específica
  moveTaskToColumn(id: number, columnId: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/move-to-column/${columnId}`, {}, this.httpOptions);
  }
}
