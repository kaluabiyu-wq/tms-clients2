export interface CreateProgramRequest { code: string; name: string; description?: string; durationMonths?: number | null; }
export interface AddProgramCourseRequest { courseId: number; sequence: number; isRequired: boolean; }
export interface RegisterStudentProgramRequest { programId: number; studentId: number; }
export interface ProgramCourseProgress {
  programCourseId: number; courseId: number; courseCode: string; courseTitle: string;
  sequence: number; isRequired: boolean; status: 'NotStarted' | 'InProgress' | 'Completed';
  startedAt?: string | null; completedAt?: string | null;
}
export interface TrainingProgram {
  id: number; code: string; name: string; description: string; durationMonths?: number | null;
  isActive: boolean; courseCount: number; enrolledStudents: number; courses: ProgramCourseProgress[];
}
export interface StudentProgramProgress {
  enrollmentId: number; studentId: number; studentName: string; programId: number;
  programCode: string; programName: string; enrollmentStatus: string; totalCourses: number;
  completedCourses: number; remainingCourses: number; completionPercent: number;
  isEligibleForCompletion: boolean; currentCourse?: string | null; courses: ProgramCourseProgress[];
}
