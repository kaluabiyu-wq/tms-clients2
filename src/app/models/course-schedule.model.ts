export interface CourseSchedule {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  classroomId: number;
  classroomName: string;
  classroomLocation: string;
  startAt: string;
  endAt: string;
  topic?: string | null;
  isCancelled: boolean;
}

export interface CreateCourseScheduleRequest {
  courseId: number;
  instructorId: string;
  classroomId: number;
  startAt: string;
  endAt: string;
  topic?: string | null;
}

export interface UpdateCourseScheduleRequest extends CreateCourseScheduleRequest {
  isCancelled: boolean;
}
