import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';
import { ReportService } from '../../services/report.service';
import { DashboardSummary } from '../../models/report.model';

@Component({
  selector: 'tms-dashboard-summary', standalone: true, imports: [CommonModule],
  templateUrl: './dashboard-summary.html',
  styleUrl: './dashboard-summary.scss'
})
export class DashboardSummaryComponent {
  readonly store = inject(EnrollmentStore);
  readonly summary = signal<DashboardSummary | null>(null);
  constructor() { inject(ReportService).dashboard().subscribe({next:value=>this.summary.set(value),error:()=>undefined}); }
}
