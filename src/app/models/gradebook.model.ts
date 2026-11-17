export interface AssessmentGradeItem {
  assessmentId: number;
  assessmentTitle: string;
  maxScore: number;
  weight: number;
  gradeRecordId: number | null;
  score: number | null;
  weightedScore: number | null;
  isPublished: boolean;
  feedback: string | null;
  gradedAt: string | null;
}

export interface StudentGrade {
  studentId: number;
  studentName: string;
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  finalGrade: number | null;
  calculatedGrade: number | null;
  gradeLevel: string;
  isComplete: boolean;
  assessments: AssessmentGradeItem[];
}

export interface CourseGradebook {
  courseId: number;
  courseTitle: string;
  totalWeight: number;
  weightsValid: boolean;
  students: StudentGrade[];
}

export interface GradeRecord {
  id: number;
  enrollmentId: number;
  assessmentId: number;
  assessmentTitle: string;
  score: number;
  maxScore: number;
  weightedScore: number;
  isPublished: boolean;
  isManualOverride: boolean;
  feedback?: string;
  gradedAt: string;
}

export interface SaveGradeRequest {
  enrollmentId: number;
  assessmentId: number;
  score: number;
  feedback?: string;
}

export interface GradeAppeal {
  id: number;
  enrollmentId: number;
  courseTitle: string;
  studentName: string;
  reason: string;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  response?: string;
  submittedAt: string;
  reviewedAt?: string;
}