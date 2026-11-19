import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiV2Url } from './api-url';
import {
  InstructorAssessment, InstructorCourse, InstructorDashboard,
  InstructorProfile, InstructorStudent,
} from '../models/instructor.model';

/** Instructor-portal API. Every endpoint is scoped server-side to the signed-in instructor. */
@Injectable({ providedIn: 'root' })
export class InstructorService {
  private http = inject(HttpClient);
  private readonly base = `${apiV2Url}/instructor`;

  getDashboard(): Observable<InstructorDashboard> {
    return this.http.get<InstructorDashboard>(`${this.base}/dashboard`);
  }
  getCourses(): Observable<InstructorCourse[]> {
    return this.http.get<InstructorCourse[]>(`${this.base}/courses`);
  }
  getStudents(courseId?: number): Observable<InstructorStudent[]> {
    let params = new HttpParams();
    if (courseId) params = params.set('courseId', courseId);
    return this.http.get<InstructorStudent[]>(`${this.base}/students`, { params });
  }
  getAssessments(courseId?: number): Observable<InstructorAssessment[]> {
    let params = new HttpParams();
    if (courseId) params = params.set('courseId', courseId);
    return this.http.get<InstructorAssessment[]>(`${this.base}/assessments`, { params });
  }
  getProfile(): Observable<InstructorProfile> {
    return this.http.get<InstructorProfile>(`${this.base}/profile`);
  }
}
