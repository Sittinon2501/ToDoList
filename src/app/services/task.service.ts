// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/task'; // URL ของ backend API

  constructor(private http: HttpClient) {}

  // เพิ่มงานใหม่
  addTask(taskData: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/add`, taskData, {
      observe: 'response',
    });
  }

  // ดึงงานทั้งหมด
  getAllTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllTask`);
  }

  // ดึงงานตาม Priority
  getTasksByPriority(priority: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/priority/${priority}`);
  }

  // อัปเดตสถานะของงานตาม ID
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateStatus/${taskId}`, { status });
  }
  
  updateTaskPriority(taskId: number, newPriority: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePriority/${taskId}`, {
      priority: newPriority,
    });
  }
   // ลบงานตาม ID
   deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${taskId}`);
  }
}
