import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Classroom, CreateClassroomRequest, UpdateClassroomRequest } from '../models/classroom.model';
import { PagedResponse } from '../models/course.model';
import { apiV2Url } from './api-url';

@Injectable({ providedIn: 'root' })
export class ClassroomService {
  private http = inject(HttpClient);
  private readonly base = `${apiV2Url}/classrooms`;

  list(page = 1, pageSize = 50) {
    return this.http.get<PagedResponse<Classroom>>(this.base, {
      params: { page: String(page), pageSize: String(pageSize) },
    });
  }

  getById(id: number) {
    return this.http.get<Classroom>(`${this.base}/${id}`);
  }

  create(request: CreateClassroomRequest) {
    return this.http.post<Classroom>(this.base, request);
  }

  update(id: number, request: UpdateClassroomRequest) {
    return this.http.put<Classroom>(`${this.base}/${id}`, request);
  }
}
