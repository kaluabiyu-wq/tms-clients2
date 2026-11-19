import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiV2Url } from './api-url';

export interface CreateStudentRequest {
  firstName: string; lastName: string; email: string; password: string; registrationNumber?: string | null;
}
export interface CreateInstructorRequest {
  firstName: string; lastName: string; email: string; password: string; department?: string | null;
}
export interface CreatedAccount {
  id: string; email: string; role: string; studentId?: number; registrationNumber?: string;
}

/** Admin-only account creation. The API enforces the Admin role. */
@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private readonly base = `${apiV2Url}/admin/users`;

  createStudent(req: CreateStudentRequest): Observable<CreatedAccount> {
    return this.http.post<CreatedAccount>(`${this.base}/students`, req);
  }
  createInstructor(req: CreateInstructorRequest): Observable<CreatedAccount> {
    return this.http.post<CreatedAccount>(`${this.base}/instructors`, req);
  }
}
