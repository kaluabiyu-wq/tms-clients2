import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiV2Url } from './api-url';
import { StudentFullProfile } from '../models/student-profile.model';

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private http = inject(HttpClient);

  getMyProfile(): Observable<StudentFullProfile> {
    return this.http.get<StudentFullProfile>(`${apiV2Url}/student/profile`);
  }
}
