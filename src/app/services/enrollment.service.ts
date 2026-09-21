import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
   private baseUrl = 'http://localhost:5285/api/v1/enrollments';
   
  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }

  approve(id: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.baseUrl}/${id}/approve`, {});
  }
}