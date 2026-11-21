import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart.componenet';

@Component({
  selector: 'ta-instructor-dashboard',
  standalone: true,
  imports: [AnalyticsChartComponent, RouterLink],
  templateUrl: './instructur-dashboard.componenet.html',
  styleUrl: './instructur-dashboard.componenet.scss'
})
export class InstructorDashboardComponent implements OnInit {
  store = inject(EnrollmentStore);
  readonly approvedCount = computed(() => this.store.entities().filter(row => row.status === 'Approved').length);
  readonly rejectedCount = computed(() => this.store.entities().filter(row => row.status === 'Rejected').length);

  ngOnInit() {
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }
}
