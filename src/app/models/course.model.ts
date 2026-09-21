
export interface Course {
  id: number;
  code: string;
  title: string;
  maxCapacity: number;
  enrollmentCount: number;
  statuse?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}


export interface CourseLink {
  href: string;
  rel: string;
  method: string;
}


export interface CourseDetail extends Course {
  links: readonly CourseLink[];
}

export interface EnrolledStudent { 
studentId: number; 
registrationNumber: string; 
name: string; 
} 
export interface CourseDetail extends Course { 
description: string | null; 
enrollments: EnrolledStudent[]; 
}