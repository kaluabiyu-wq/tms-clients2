import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';
import { ReportMetric } from '../../models/report.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3>{{ title() }}</h3>
      @if (metrics()?.length) {
        <div class="metric-bars">
          @for (metric of metrics(); track metric.key) {
            <div class="metric-row"><div class="metric-label"><span>{{metric.label}}</span><strong>{{metric.value | number:'1.0-1'}}{{metric.unit ?? ''}}</strong></div><div class="track"><div class="fill" [style.width.%]="barWidth(metric.value)"></div></div></div>
          }
        </div>
        <p class="chart-summary">{{metrics()?.length}} categories</p>
      } @else {
        <div class="chart-bars">
          <div class="bar approved" [style.height.px]="approvedHeight()"><span>Approved</span></div>
          <div class="bar pending" [style.height.px]="pendingHeight()"><span>Pending</span></div>
          <div class="bar rejected" [style.height.px]="rejectedHeight()"><span>Rejected</span></div>
        </div>
        <p class="chart-summary">Total records: {{ data().length }}</p>
      }
    </div>
  `,
  
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
