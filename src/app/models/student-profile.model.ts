export interface StudentAccount {
  userId: string; email: string; emailConfirmed: boolean;
  firstName: string; lastName: string; fullName: string; phoneNumber?: string | null;
}
export interface StudentRecord {
  id: number; registrationNumber: string; name: string; gpa: number; status: string; isActive: boolean;
}
export interface ProfileEnrollment {
  enrollmentId: number; courseId: number; courseCode: string; courseTitle: string;
  instructorName?: string | null; year: number; status: string; grade?: number | null; enrolledAt: string;
}
export interface ProfileCertificate {
  id: number; serialNumber: string; courseCode: string; courseTitle: string; status: string; issuedAt: string;
}
export interface ProfileProgram {
  programId: number; code: string; name: string; status: string; enrolledAt: string; completedAt?: string | null;
}
export interface AttendanceSummary {
  present: number; late: number; excused: number; absent: number; total: number; attendanceRate?: number | null;
}
export interface AcademicSummary {
  totalCourses: number; approvedCourses: number; pendingCourses: number; gradedCourses: number;
  averageGrade?: number | null; certificates: number;
}
export interface StudentFullProfile {
  account: StudentAccount; student: StudentRecord; summary: AcademicSummary; attendance: AttendanceSummary;
  enrollments: ProfileEnrollment[]; certificates: ProfileCertificate[]; programs: ProfileProgram[];
}
