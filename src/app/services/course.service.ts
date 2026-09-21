import { inject, Injectable, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Course, CourseDetail, PagedResponse } from "../models/course.model";
import { CreateEnrollmentRequest,EnrollmentResult } from "../models/enrollment.model";
import { environment } from "../../environments/environment.development";

@Service()
export class CourseService {
  private http = inject(HttpClient);
  private  readonly base = `${environment.apiUrl}/courses`;

  
  getAll(){
    return this.http .get<PagedResponse<Course>>(this.base, {
        params: { page: '1', pageSize: '50' },
      })
      .pipe(map(response => response.items));
  }


  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.base}/${id}`);
  }


  enroll(courseId: number, request: CreateEnrollmentRequest) {
    return this.http.post<EnrollmentResult>( `${this.base}/${courseId}/enrollments`,
      request,
    );
  }
}