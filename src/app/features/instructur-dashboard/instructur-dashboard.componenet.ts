import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChartComponent } from "../../ui/analytics-chart/analytics-chart.componenet";
@Component({
  selector: 'tms-instructor-dashboard',
  standalone: true,
  imports: [AnalyticsChartComponent],  
  templateUrl: './instructur-dashboard.componenet.html'
 
  
})
export class InstructorDashboardComponent {
  store = inject(EnrollmentStore);
}