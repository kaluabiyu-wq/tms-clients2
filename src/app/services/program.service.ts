import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiV2Url } from './api-url';
import { AddProgramCourseRequest, CreateProgramRequest, RegisterStudentProgramRequest, StudentProgramProgress, TrainingProgram } from '../models/program.model';

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private readonly http = inject(HttpClient);
  private readonly base = `${apiV2Url}/programs`;

  getPrograms(includeInactive = false) {
    const params = new HttpParams().set('includeInactive', String(includeInactive));
    return this.http.get<TrainingProgram[]>(this.base, { params });
  }
  createProgram(request: CreateProgramRequest) {
    return this.http.post<TrainingProgram>(this.base, request);
  }
  addCourse(programId: number, request: AddProgramCourseRequest) {
    return this.http.post<TrainingProgram>(`${this.base}/${programId}/courses`, request);
  }
  registerStudent(request: RegisterStudentProgramRequest) {
    return this.http.post<StudentProgramProgress>(`${apiV2Url}/students/${request.studentId}/programs`, request);
  }
  getStudentProgress(studentId: number) {
    return this.http.get<StudentProgramProgress[]>(`${apiV2Url}/students/${studentId}/progress`);
  }
  getMyProgress() {
    return this.http.get<StudentProgramProgress[]>(`${apiV2Url}/students/me/progress`);
  }
  getProgramProgress(programId: number) {
    return this.http.get<StudentProgramProgress[]>(`${this.base}/${programId}/progress`);
  }
  recalculate(studentId: number, enrollmentId: number) {
    return this.http.post<StudentProgramProgress>(`${apiV2Url}/students/${studentId}/programs/${enrollmentId}/recalculate`, {});
  }
}
