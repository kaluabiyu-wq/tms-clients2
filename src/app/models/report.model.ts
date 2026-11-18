export type ReportType = 'students' | 'enrollment' | 'courses' | 'attendance' | 'performance' | 'certificates' | 'instructors' | 'completion';
export type ReportFormat = 'pdf' | 'xlsx';
export interface ReportMetric { key: string; label: string; value: number; unit?: string | null; }
export interface DashboardSummary {
  generatedAtUtc: string; totalStudents: number; activeStudents: number; inactiveStudents: number; graduatedStudents: number;
  totalCourses: number; approvedEnrollments: number; pendingEnrollments: number; rejectedEnrollments: number;
  averageAttendancePercent: number; averagePerformancePercent: number; passRatePercent: number;
  issuedCertificates: number; revokedCertificates: number; completedStudents: number;
  enrollmentDistribution: ReportMetric[]; attendanceDistribution: ReportMetric[]; performanceByCourse: ReportMetric[];
}
export interface ReportPage {
  reportType: ReportType; page: number; pageSize: number; total: number; totalPages: number;
  metrics: ReportMetric[]; items: Record<string, unknown>[];
}
export interface ReportFilter { from?: string; to?: string; page?: number; pageSize?: number; search?: string; courseId?: number; passMark?: number; }
export interface GenerateReportRequest { reportType: ReportType; format: ReportFormat; from?: string; to?: string; search?: string; courseId?: number; passMark?: number; }
export interface GeneratedReport {
  id: number; reportType: ReportType; format: ReportFormat; status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  fileName?: string | null; contentType?: string | null; fileSizeBytes?: number | null; errorMessage?: string | null;
  requestedAt: string; completedAt?: string | null; expiresAt?: string | null;
}
