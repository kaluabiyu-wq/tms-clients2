export interface InstructorCourse {
  id: number;
  code: string;
  title: string;
  description: string;
  maxCapacity: number;
  approvedStudents: number;
  pendingStudents: number;
  assessmentCount: number;
}

export interface InstructorStudent {
  studentId: number;
  name: string;
  registrationNumber: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  enrollmentStatus: string;
  grade?: number | null;
}

export interface InstructorAssessment {
  id: number;
  courseId: number;
  courseCode: string;
  title: string;
  status: string;
  maxScore: number;
  weight: number;
  opensAt?: string | null;
  closesAt?: string | null;
  questionCount: number;
}

export interface InstructorProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department?: string | null;
}

export interface UpcomingClass {
  scheduleId: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  startAt: string;
  endAt: string;
  classroomName: string;
  topic?: string | null;
}

export interface InstructorDashboard {
  courseCount: number;
  studentCount: number;
  pendingEnrollments: number;
  draftAssessments: number;
  publishedAssessments: number;
  upcomingClassCount: number;
  nextClasses: UpcomingClass[];
}
