import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorCourse } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1>My courses</h1>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (loading()) { <p>Loading…</p> }
      @else if (!items().length) { <p>No courses are assigned to you yet.</p> }
      @else {
        @for (c of items(); track c.id) {
          <article class="row">
            <div>
              <h3>{{ c.code }} — {{ c.title }}</h3>
              <p>{{ c.description }}</p>
              <p class="meta">{{ c.approvedStudents }}/{{ c.maxCapacity }} students · {{ c.pendingStudents }} pending · {{ c.assessmentCount }} assessments</p>
            </div>
            <div class="actions">
              <a [routerLink]="['/instructor/students']" [queryParams]="{ courseId: c.id }">Students</a>
              <a [routerLink]="['/courses', c.id, 'assessments']">Assessments</a>
              <a [routerLink]="['/instructor/gradebook']" [queryParams]="{ courseId: c.id }">Gradebook</a>
            </div>
          </article>
        }
      }
    </section>
  `,
  styles: [`
    .page{padding:1.5rem}.row{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1rem;margin:.75rem 0;border:1px solid #d9dee8;border-radius:9px}
    .row h3{margin:0 0 .4rem}.row p{margin:.2rem 0}.meta{color:#667085}
    .actions{display:flex;gap:.5rem;align-items:flex-start;flex-wrap:wrap}
    .actions a{padding:.5rem .8rem;border-radius:7px;background:#2457a7;color:#fff;text-decoration:none}.error{color:#a32121}
  `],
})
export class InstructorCoursesComponent {
  private service = inject(InstructorService);
  items = signal<InstructorCourse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.service.getCourses().subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e)); this.loading.set(false); },
    });
  }
}
