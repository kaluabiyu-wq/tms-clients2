import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';
import { ReportService } from '../../services/report.service';
import { DashboardSummary } from '../../models/report.model';

@Component({
  selector: 'tms-dashboard-summary', standalone: true, imports: [CommonModule],
  template: `<section class="summary-widget"><div><strong>{{ store.pendingCount() }}</strong><span> Pending enrollments</span></div>@if(summary();as s){<div><strong>{{s.totalStudents}}</strong><span> Students</span></div><div><strong>{{s.totalCourses}}</strong><span> Courses</span></div><div><strong>{{s.averageAttendancePercent}}%</strong><span> Attendance</span></div>}</section>`,
  styles: [`.summary-widget{display:flex;gap:20px;flex-wrap:wrap}.summary-widget div{display:flex;gap:5px;align-items:baseline}.summary-widget strong{font-size:20px}.summary-widget span{color:#667085;font-size:13px}`]
})
export class DashboardSummaryComponent {
  readonly store = inject(EnrollmentStore);
  readonly summary = signal<DashboardSummary | null>(null);
  constructor() { inject(ReportService).dashboard().subscribe({next:value=>this.summary.set(value),error:()=>undefined}); }
}
