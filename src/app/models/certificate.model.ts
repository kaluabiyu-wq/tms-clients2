export interface IssueCertificateRequest {
  studentId: number;
  courseId: number;
  templateId?: number | null;
}

export interface CertificateDetails {
  id: number;
  serialNumber: string;
  status: 'Issued' | 'Revoked' | string;
  issuedAt: string;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  verificationCode: string;
  revocationReason?: string | null;
}

export interface PublicCertificateVerification {
  isValid: boolean;
  status: 'Valid' | 'Revoked' | 'NotFound' | string;
  message: string;
  serialNumber?: string | null;
  studentName?: string | null;
  courseName?: string | null;
  issuedAt?: string | null;
  institutionName?: string | null;
}


export interface CertificateTemplate {
  id: number;
  name: string;
  institutionName: string;
  logoPath?: string | null;
  signatureName?: string | null;
  signatureTitle?: string | null;
  certificateTitle: string;
  bodyText: string;
  minimumFinalGrade: number;
  minimumAttendancePercent: number;
  requireCompletedEnrollment: boolean;
  requireAllPublishedAssessments: boolean;
  isActive: boolean;
}

export type SaveCertificateTemplate = Omit<CertificateTemplate, 'id'>;
