import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorCourse, InstructorStudent } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-students',
  standalone: true,
  templateUrl: './instructor-students.component.html',
  styleUrl: './instructor-students.component.scss',
})
export class InstructorStudentsComponent {
  private service = inject(InstructorService);
  private route = inject(ActivatedRoute);
  courses = signal<InstructorCourse[]>([]);
  items = signal<InstructorStudent[]>([]);
  courseId = signal<number | undefined>(undefined);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    const q = Number(this.route.snapshot.queryParamMap.get('courseId'));
    if (q) this.courseId.set(q);
    this.service.getCourses().subscribe({ next: c => this.courses.set(c), error: e => this.error.set(problemMessage(e)) });
    this.load();
  }

  onCourse(value: string) {
    this.courseId.set(value ? Number(value) : undefined);
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.service.getStudents(this.courseId()).subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e)); this.loading.set(false); },
    });
  }
}
