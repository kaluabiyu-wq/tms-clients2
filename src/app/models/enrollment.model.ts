export interface CreateEnrollmentRequest {
  /** Student registration number, e.g. STU-0001. */
  studentId: string;
}

export interface EnrollmentResult {
  id: number;
  courseId: number;
  studentId: string;
  enrolledAt: string;
}

export interface Enrollment {
  id: number;
  studentId: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  enrolledAt: string;
}

export interface EnrollmentSummaryDto extends Enrollment {}
