export interface Classroom {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createdAt: string; // ISO-8601 UTC
}

export interface CreateClassroomRequest {
  name: string;
  location: string;
  capacity: number;
}

export interface UpdateClassroomRequest extends CreateClassroomRequest {
  isActive: boolean;
}
