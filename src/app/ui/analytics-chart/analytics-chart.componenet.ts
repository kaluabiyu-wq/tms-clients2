import { Component, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  template: `<div>Chart with {{ data().length }} points</div>`,
})
export class AnalyticsChartComponent {
  data = input.required<Enrollment[]>();
}