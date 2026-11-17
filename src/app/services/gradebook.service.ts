import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseGradebook, StudentCourseGrade, GradeAppealRequest, ReviewGradeAppealRequest } from '../models/gradebook.model';

@Injectable({ providedIn: 'root' })
export class GradebookService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v2/gradebook';

  getCourseGradebook(courseId: number): Observable<CourseGradebook> {
    return this.http.get<CourseGradebook>(`${this.baseUrl}/courses/${courseId}`);
  }
  publishAssessmentGrades(courseId: number, assessmentId: number): Observable<{ assessmentId: number; publishedCount: number }> {
    return this.http.post<{ assessmentId: number; publishedCount: number }>(`${this.baseUrl}/courses/${courseId}/assessments/${assessmentId}/publish`, {});
  }
  calculateFinalGrades(courseId: number): Observable<{ updatedEnrollmentGrades: number; enrolledStudents: number; pendingIncomplete: number }> {
    return this.http.post<{ updatedEnrollmentGrades: number; enrolledStudents: number; pendingIncomplete: number }>(`${this.baseUrl}/courses/${courseId}/calculate-final`, {});
  }
  getMyGrades(): Observable<StudentCourseGrade[]> {
    return this.http.get<StudentCourseGrade[]>(`${this.baseUrl}/my-courses`);
  }
  submitAppeal(gradeRecordId: number, request: GradeAppealRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/records/${gradeRecordId}/appeals`, request);
  }
  getCourseAppeals(courseId: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/courses/${courseId}/appeals`);
  }
  reviewAppeal(appealId: number, request: ReviewGradeAppealRequest): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/appeals/${appealId}/review`, request);
  }
}
