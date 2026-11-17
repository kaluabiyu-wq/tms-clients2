import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiV2Url } from './api-url';
import {
  CertificateDetails, IssueCertificateRequest, PublicCertificateVerification, CertificateTemplate, SaveCertificateTemplate
} from '../models/certificate.model';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiV2Url}/certificates`;

  issue(request: IssueCertificateRequest): Observable<CertificateDetails> {
    return this.http.post<CertificateDetails>(`${this.baseUrl}/issue`, request);
  }

  getAll(take = 100): Observable<CertificateDetails[]> {
    return this.http.get<CertificateDetails[]>(`${this.baseUrl}?take=${take}`);
  }

  getById(id: number): Observable<CertificateDetails> {
    return this.http.get<CertificateDetails>(`${this.baseUrl}/${id}`);
  }

  getForStudent(studentId: number): Observable<CertificateDetails[]> {
    return this.http.get<CertificateDetails[]>(`${this.baseUrl}/student/${studentId}`);
  }

  getMyCertificates(): Observable<CertificateDetails[]> {
    return this.http.get<CertificateDetails[]>(`${this.baseUrl}/student/me`);
  }

  verify(code: string): Observable<PublicCertificateVerification> {
    return this.http.get<PublicCertificateVerification>(
      `${this.baseUrl}/verify/${encodeURIComponent(code)}`
    );
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
  }

  getTemplates(): Observable<CertificateTemplate[]> {
    return this.http.get<CertificateTemplate[]>(`${apiV2Url}/certificate-templates`);
  }

  createTemplate(template: SaveCertificateTemplate): Observable<CertificateTemplate> {
    return this.http.post<CertificateTemplate>(`${apiV2Url}/certificate-templates`, template);
  }

  updateTemplate(id: number, template: SaveCertificateTemplate): Observable<CertificateTemplate> {
    return this.http.put<CertificateTemplate>(`${apiV2Url}/certificate-templates/${id}`, template);
  }

  revoke(id: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/revoke`, { reason });
  }
}
