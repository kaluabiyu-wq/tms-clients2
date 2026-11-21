import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorDashboard } from '../../models/instructor.model';
import { AuthService } from '../../services/auth.service';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-portal-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss',
})
export class InstructorPortalDashboardComponent {
  private service = inject(InstructorService);
  auth = inject(AuthService);
  data = signal<InstructorDashboard | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.service.getDashboard().subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e)); this.loading.set(false); },
    });
  }
}
