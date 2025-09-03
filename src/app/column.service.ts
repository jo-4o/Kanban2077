import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ColumnDto {
  id?: number;
  columnId: string;
  title: string;
  displayOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private apiUrl = 'http://localhost:8080/api/columns';

  constructor(private http: HttpClient) { }

  getAllColumns(): Observable<ColumnDto[]> {
    return this.http.get<ColumnDto[]>(this.apiUrl);
  }

  getColumnById(id: number): Observable<ColumnDto> {
    return this.http.get<ColumnDto>(`${this.apiUrl}/${id}`);
  }

  createColumn(column: Partial<ColumnDto>): Observable<ColumnDto> {
    return this.http.post<ColumnDto>(this.apiUrl, column);
  }

  updateColumn(id: number, column: Partial<ColumnDto>): Observable<ColumnDto> {
    return this.http.put<ColumnDto>(`${this.apiUrl}/${id}`, column);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reorderColumns(columnIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reorder`, { columnIds });
  }

  initializeDefaultColumns(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/initialize`, {});
  }
}
