import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorAssessment } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-assessments',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './instructor-assessments.component.html',
  styleUrl: './instructor-assessments.component.scss',
})
export class InstructorAssessmentsComponent {
  private service = inject(InstructorService);
  items = signal<InstructorAssessment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.service.getAssessments().subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e)); this.loading.set(false); },
    });
  }
}
