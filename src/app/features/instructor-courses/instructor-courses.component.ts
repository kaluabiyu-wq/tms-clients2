import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorCourse } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.scss',
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
