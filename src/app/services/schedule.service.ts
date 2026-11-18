import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiV2Url } from './api-url';
import { CourseSchedule, CreateCourseScheduleRequest, UpdateCourseScheduleRequest } from '../models/course-schedule.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private http = inject(HttpClient);
  private readonly base = apiV2Url;

  create(request: CreateCourseScheduleRequest) {
    return this.http.post<CourseSchedule>(`${this.base}/schedules`, request);
  }

  update(id: number, request: UpdateCourseScheduleRequest) {
    return this.http.put<CourseSchedule>(`${this.base}/schedules/${id}`, request);
  }

  getCalendar(from: string, to: string, instructorId?: string, classroomId?: number) {
    let params = new HttpParams().set('from', from).set('to', to);
    if (instructorId) params = params.set('instructorId', instructorId);
    if (classroomId) params = params.set('classroomId', String(classroomId));
    return this.http.get<CourseSchedule[]>(`${this.base}/schedules/calendar`, { params });
  }

  getInstructorSchedule(id: string, from: string, to: string) {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<CourseSchedule[]>(`${this.base}/instructors/${encodeURIComponent(id)}/schedule`, { params });
  }

  getCourseSchedule(id: number, from: string, to: string) {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<CourseSchedule[]>(`${this.base}/courses/${id}/schedule`, { params });
  }
}
