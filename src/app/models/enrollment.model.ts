export interface CreateEnrollmentRequest {
  studentId: string;
}

export interface EnrollmentResult {
  id: number;
  courseId: number;
  studentId: string;
  enrolledAt: string;
}

