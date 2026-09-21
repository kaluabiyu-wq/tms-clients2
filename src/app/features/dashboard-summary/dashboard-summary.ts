import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-dashboard-summary',
  standalone: true,
  template: `<div class="summary-widget">{{ store.pendingCount() }} Pending</div>`,
})
export class DashboardSummaryComponent {
  store = inject(EnrollmentStore);
}