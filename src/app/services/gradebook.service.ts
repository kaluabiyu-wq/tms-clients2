import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CourseGradebook, StudentGrade, SaveGradeRequest, GradeRecord, GradeAppeal
} from '../models/gradebook.model';

@Injectable({ providedIn: 'root' })
export class GradebookService {
  private http = inject(HttpClient);
  private readonly api = '/api/v2/gradebook';

  getCourseGradebook(courseId: number): Observable<CourseGradebook> {
    return this.http.get<CourseGradebook>(`${this.api}/course/${courseId}`);
  }

  getMyGrades(): Observable<StudentGrade[]> {
    return this.http.get<StudentGrade[]>(`${this.api}/me`);
  }

  getStudentGrades(studentId: number): Observable<StudentGrade[]> {
    return this.http.get<StudentGrade[]>(`${this.api}/student/${studentId}`);
  }

  saveGrade(request: SaveGradeRequest): Observable<GradeRecord> {
    return this.http.post<GradeRecord>(this.api, request);
  }

  updateGrade(id: number, body: { score: number; feedback?: string }): Observable<GradeRecord> {
    return this.http.put<GradeRecord>(`${this.api}/${id}`, body);
  }

  publishAssessmentGrade(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/publish`, {});
  }

  correctGrade(
    id: number,
    body: { newScore: number; reason: string; appealId?: number | null }
  ): Observable<GradeRecord> {
    return this.http.post<GradeRecord>(`${this.api}/${id}/correct`, body);
  }

  publishFinalGrade(enrollmentId: number): Observable<{ enrollmentId: number; finalGrade: number }> {
    return this.http.post<{ enrollmentId: number; finalGrade: number }>(
      `${this.api}/enrollments/${enrollmentId}/publish`, {});
  }

  submitAppeal(enrollmentId: number, reason: string): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      `${this.api}/enrollments/${enrollmentId}/appeals`, { reason });
  }

  getMyAppeals(): Observable<GradeAppeal[]> {
    return this.http.get<GradeAppeal[]>(`${this.api}/appeals/mine`);
  }

  getAppeals(status?: string, courseId?: number): Observable<GradeAppeal[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (courseId) params = params.set('courseId', courseId);
    return this.http.get<GradeAppeal[]>(`${this.api}/appeals`, { params });
  }

  reviewAppeal(id: number, body: { status: string; response?: string }): Observable<void> {
    return this.http.put<void>(`${this.api}/appeals/${id}`, body);
  }
}