import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AttendanceEntryRequest,
  AttendanceRecord,
  CourseAttendanceSummary,
  CreateSessionRequest,
  SessionAttendance,
  StudentAttendance,
  TrainingSession,
  UpdateAttendanceRequest,
} from '../models/attendance.model';
import { PagedResponse } from '../models/course.model';
import { apiV2Url } from './api-url';

/** One service per API resource (docs/API-STANDARDS.md). Every URL below is v2. */
@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);

  createSession(request: CreateSessionRequest) {
    return this.http.post<TrainingSession>(`${apiV2Url}/sessions`, request);
  }

  listSessions(courseId: number, page = 1, pageSize = 50) {
    return this.http.get<PagedResponse<TrainingSession>>(`${apiV2Url}/courses/${courseId}/sessions`, {
      params: { page: String(page), pageSize: String(pageSize) },
    });
  }

  /** The roster: every approved student of the course plus their current mark for this session. */
  getSessionAttendance(sessionId: number) {
    return this.http.get<SessionAttendance>(`${apiV2Url}/sessions/${sessionId}/attendance`);
  }

  /** Saves the roster in one call (upsert). Sending the same roster twice is safe. */
  saveAttendance(sessionId: number, entries: AttendanceEntryRequest[]) {
    return this.http.post<SessionAttendance>(`${apiV2Url}/sessions/${sessionId}/attendance`, { entries });
  }

  updateRecord(recordId: number, request: UpdateAttendanceRequest) {
    return this.http.put<AttendanceRecord>(`${apiV2Url}/attendance/${recordId}`, request);
  }

  getStudentAttendance(studentId: number, courseId: number | null = null, page = 1, pageSize = 20) {
    const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) };
    if (courseId !== null) {
      params['courseId'] = String(courseId);
    }
    return this.http.get<StudentAttendance>(`${apiV2Url}/students/${studentId}/attendance`, { params });
  }

  getCourseSummary(courseId: number) {
    return this.http.get<CourseAttendanceSummary>(`${apiV2Url}/courses/${courseId}/attendance/summary`);
  }
}
