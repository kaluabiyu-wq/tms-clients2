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
  template: `
    <section class="page">
      <h1>My assessments</h1>
      <p class="hint">Open a course's assessments to create or edit them, manage questions and view submissions.</p>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (loading()) { <p>Loading…</p> }
      @else if (!items().length) { <p>No assessments yet. Open one of your courses to create one.</p> }
      @else {
        <table>
          <thead><tr><th>Course</th><th>Title</th><th>Status</th><th>Questions</th><th>Max</th><th>Weight</th><th>Closes</th><th></th></tr></thead>
          <tbody>
            @for (a of items(); track a.id) {
              <tr>
                <td>{{ a.courseCode }}</td><td>{{ a.title }}</td><td>{{ a.status }}</td><td>{{ a.questionCount }}</td>
                <td>{{ a.maxScore }}</td><td>{{ a.weight }}</td><td>{{ a.closesAt ? (a.closesAt | date:'medium') : '—' }}</td>
                <td class="links">
                  <a [routerLink]="['/courses', a.courseId, 'assessments', a.id, 'questions']">Questions</a>
                  <a [routerLink]="['/courses', a.courseId, 'assessments', a.id, 'submissions']">Submissions</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: [`
    .page{padding:1.5rem}.hint{color:#667085}table{width:100%;border-collapse:collapse}
    th,td{text-align:left;padding:.6rem;border-bottom:1px solid #e4e7ec}.links a{margin-right:.6rem}.error{color:#a32121}
  `],
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
