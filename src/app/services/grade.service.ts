import { HttpClient } from '@angular/common/http';
import { inject, Service,Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GradePayload {
    studentId: number;
    courseId: number;
    score: number;
}

@Injectable({ providedIn: 'root' })
export class GradeService {
    private http = inject(HttpClient);

    postGrade(payload: GradePayload): Observable<{ id: string; success: boolean}> 
{
    return this.http.post<{ id:string; success: boolean}>('api/grades',payload);
}
 
}
