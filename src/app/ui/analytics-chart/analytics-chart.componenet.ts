import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';
import { ReportMetric } from '../../models/report.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-chart.componenet.html',
  
  styleUrl: `analytics-chart.componenet.scss`
})
export class AnalyticsChartComponent {
  data = input<Enrollment[]>([]);
  metrics = input<ReportMetric[] | null>(null);
  title = input("Enrollment Analytics");
  barWidth(value: number): number { const max = Math.max(1, ...(this.metrics() ?? []).map(x => x.value)); return Math.max(2, Math.min(100, value / max * 100)); }

 
  approvedHeight = computed(() => {
    const count = this.data().filter(e => e.status === 'Approved').length;
    return Math.max(20, count * 3);
  });

  pendingHeight = computed(() => {
    const count = this.data().filter(e => e.status === 'Pending').length;
    return Math.max(20, count * 3);
  });

  rejectedHeight = computed(() => {
    const count = this.data().filter(e => e.status === 'Rejected').length;
    return Math.max(20, count * 3);
  });
}
