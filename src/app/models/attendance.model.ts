import { PagedResponse } from './course.model';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused'];

/** A scheduled meeting of a course. All timestamps are ISO-8601 UTC. */
export interface TrainingSession {
  id: number;
  courseId: number;
  courseCode: string;
  topic: string;
  startAt: string;
  endAt: string;
  instructorId: string;
  enrolledCount: number;
  recordedCount: number;
}

export interface CreateSessionRequest {
  courseId: number;
  topic: string;
  startAt: string;
  endAt: string;
}

export interface AttendanceEntryRequest {
  studentId: number;
  status: AttendanceStatus;
  remarks?: string | null;
  checkInAt?: string | null;
}

export interface UpdateAttendanceRequest {
  status: AttendanceStatus;
  remarks?: string | null;
  checkInAt?: string | null;
}

export interface AttendanceRecord {
  id: number;
  sessionId: number;
  studentId: number;
  status: AttendanceStatus;
  checkInAt: string | null;
  remarks: string | null;
  recordedBy: string;
  recordedAt: string;
}

/** One line of the attendance screen. status/recordId are null until the student has been saved for this session. */
export interface SessionRosterRow {
  studentId: number;
  registrationNumber: string;
  studentName: string;
  recordId: number | null;
  status: AttendanceStatus | null;
  checkInAt: string | null;
  remarks: string | null;
  coursePercentage: number | null;
}

export interface SessionAttendance {
  session: TrainingSession;
  rows: SessionRosterRow[];
}

/** percentage is null while nothing countable exists (no divide-by-zero, no misleading 0%). */
export interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  excused: number;
  counted: number;
  percentage: number | null;
}

export interface StudentAttendanceItem {
  recordId: number;
  sessionId: number;
  courseId: number;
  courseCode: string;
  topic: string;
  sessionStartAt: string;
  status: AttendanceStatus;
  remarks: string | null;
}

export interface StudentAttendance {
  studentId: number;
  registrationNumber: string;
  studentName: string;
  summary: AttendanceSummary;
  records: PagedResponse<StudentAttendanceItem>;
}

export interface StudentSummaryRow {
  studentId: number;
  registrationNumber: string;
  studentName: string;
  summary: AttendanceSummary;
}

export interface CourseAttendanceSummary {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  sessionsHeld: number;
  overall: AttendanceSummary;
  students: StudentSummaryRow[];
}
