import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnrollmentListComponent } from './features/enrollment-list/enrollment-list.component';
import { DashboardSummaryComponent } from './features/dashboard-summary/dashboard-summary';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,EnrollmentListComponent,DashboardSummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tms-clients');
}
