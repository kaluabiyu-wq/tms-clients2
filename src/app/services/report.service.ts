import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiV2Url } from './api-url';
import { DashboardSummary, GeneratedReport, GenerateReportRequest, ReportFilter, ReportPage, ReportType } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly url = `${apiV2Url}/reports`;

  dashboard(filter: Pick<ReportFilter, 'from' | 'to' | 'passMark'> = {}): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.url}/dashboard`, { params: this.params(filter) });
  }
  getReport(type: ReportType, filter: ReportFilter): Observable<ReportPage> {
    return this.http.get<ReportPage>(`${this.url}/${type}`, { params: this.params(filter) });
  }
  generate(request: GenerateReportRequest): Observable<GeneratedReport> {
    return this.http.post<GeneratedReport>(`${this.url}/generate`, request);
  }
  status(id: number): Observable<GeneratedReport> {
    return this.http.get<GeneratedReport>(`${this.url}/${id}/status`);
  }
  download(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/${id}/download`, { responseType: 'blob' });
  }
  private params(filter: object): HttpParams {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params = params.set(key, String(value));
    });
    return params;
  }
}
