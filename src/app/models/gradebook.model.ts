export interface GradeRecord {
  id: number;
  studentId: number;
  studentName: string;
  registrationNumber: string;
  assessmentId: number;
  assessmentTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  weight: number;
  isPublished: boolean;
  publishedAt?: string | null;
}

export interface CourseGradebook {
  id: number;
  code: string;
  title: string;
  grades: GradeRecord[];
}

export interface StudentCourseGrade {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  finalGrade?: number | null;
  assessmentGrades: GradeRecord[];
}

export interface GradeAppealRequest { reason: string; }
export interface ReviewGradeAppealRequest { decision: 'Approved' | 'Rejected'; comment?: string | null; }
