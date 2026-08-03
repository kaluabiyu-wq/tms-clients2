import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Course, CourseDetail, PagedResponse } from "../models/course.model";
import { CreateEnrollmentRequest,EnrollmentResult } from "../models/enrollment.model";

@Injectable({ providedIn: "root" })
export class CourseService {
  private http = inject(HttpClient);
  private baseUrl = "http://localhost:5285/api/v1/courses";

  
  getAll(page = 1, pageSize = 50) {
    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: { page: page.toString(), pageSize: pageSize.toString() },
      })
      .pipe(map((p) => p.items));
  }


  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.baseUrl}/${id}`);
  }


  enroll(courseId: number, request: CreateEnrollmentRequest) {
    return this.http.post<EnrollmentResult>( `${this.baseUrl}/${courseId}/enrollments`,
      request,
    );
  }
}