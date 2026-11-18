import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiV2Url } from './api-url';
import { AuditFilter, AuditPage } from '../models/audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  private readonly url = `${apiV2Url}/audit`;
  get(filter: AuditFilter): Observable<AuditPage> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') params = params.set(key, String(value)); });
    return this.http.get<AuditPage>(this.url, { params });
  }
  export(filter: AuditFilter): Observable<Blob> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') params = params.set(key, String(value)); });
    return this.http.get(`${this.url}/export`, { params, responseType: 'blob' });
  }
}
