import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorCourse, InstructorStudent } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-students',
  standalone: true,
  template: `
    <section class="page">
      <h1>My students</h1>
      <label>Course
        <select (change)="onCourse($any($event.target).value)">
          <option value="">All my courses</option>
          @for (c of courses(); track c.id) {
            <option [value]="c.id" [selected]="c.id === courseId()">{{ c.code }} — {{ c.title }}</option>
          }
        </select>
      </label>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (loading()) { <p>Loading…</p> }
      @else if (!items().length) { <p>No students found.</p> }
      @else {
        <table>
          <thead><tr><th>Name</th><th>Reg. no.</th><th>Course</th><th>Status</th><th>Grade</th></tr></thead>
          <tbody>
            @for (s of items(); track s.courseId + '-' + s.studentId) {
              <tr><td>{{ s.name }}</td><td>{{ s.registrationNumber }}</td><td>{{ s.courseCode }}</td><td>{{ s.enrollmentStatus }}</td><td>{{ s.grade ?? '—' }}</td></tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: [`
    .page{padding:1.5rem}label{display:block;margin:1rem 0}select{margin-left:.5rem;padding:.4rem}
    table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:.6rem;border-bottom:1px solid #e4e7ec}.error{color:#a32121}
  `],
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
