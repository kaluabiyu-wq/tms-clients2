export interface CreateEnrollmentRequest {
  studentId: string;
}

export interface EnrollmentResult {
  id: number;
  courseId: number;
  studentId: string;
  enrolledAt: string;
}

export interface Enrollment {
id: string;
studentId: number;
studentName: string;
courseId: number;
courseName: string;
status: 'Pending' | 'Approved' | 'Rejected';
enrolledAt: string;
}

export interface EnrollmentSummaryDto {
  id: number;
  studentName: string;
  courseName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  enrolledAt: string;
}