import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { GradebookService } from '../../services/gradebook.service';
import { InstructorCourse } from '../../models/instructor.model';
import { CourseGradebook } from '../../models/gradebook.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-gradebook',
  standalone: true,
  template: `
    <section class="page">
      <h1>Gradebook</h1>
      <label>Course
        <select (change)="onCourse($any($event.target).value)">
          <option value="">Select a course…</option>
          @for (c of courses(); track c.id) {
            <option [value]="c.id" [selected]="c.id === courseId()">{{ c.code }} — {{ c.title }}</option>
          }
        </select>
      </label>
      @if (message()) { <p class="ok">{{ message() }}</p> }
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (loading()) { <p>Loading…</p> }
      @else if (book(); as b) {
        <div class="toolbar"><button type="button" (click)="calculate()">Calculate final grades</button></div>
        @if (!b.grades.length) { <p>No published grades for this course yet.</p> }
        @else {
          <table>
            <thead><tr><th>Student</th><th>Reg. no.</th><th>Assessment</th><th>Score</th><th>%</th><th>Weight</th></tr></thead>
            <tbody>
              @for (g of b.grades; track g.id) {
                <tr><td>{{ g.studentName }}</td><td>{{ g.registrationNumber }}</td><td>{{ g.assessmentTitle }}</td>
                    <td>{{ g.score }}/{{ g.maxScore }}</td><td>{{ g.percentage }}</td><td>{{ g.weight }}</td></tr>
              }
            </tbody>
          </table>
        }
      }
    </section>
  `,
  styles: [`
    .page{padding:1.5rem}label{display:block;margin:1rem 0}select{margin-left:.5rem;padding:.4rem}
    .toolbar{margin:1rem 0}button{padding:.6rem .85rem;border:0;border-radius:7px;background:#2457a7;color:#fff;cursor:pointer}
    table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:.6rem;border-bottom:1px solid #e4e7ec}
    .error{color:#a32121}.ok{color:#18794e}
  `],
})
export class InstructorGradebookComponent {
  private instructor = inject(InstructorService);
  private gradebook = inject(GradebookService);
  private route = inject(ActivatedRoute);
  courses = signal<InstructorCourse[]>([]);
  courseId = signal<number | undefined>(undefined);
  book = signal<CourseGradebook | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

  constructor() {
    this.instructor.getCourses().subscribe({ next: c => this.courses.set(c), error: e => this.error.set(problemMessage(e)) });
    const q = Number(this.route.snapshot.queryParamMap.get('courseId'));
    if (q) { this.courseId.set(q); this.load(); }
  }

  onCourse(value: string) {
    this.courseId.set(value ? Number(value) : undefined);
    this.book.set(null);
    if (value) this.load();
  }

  load() {
    const id = this.courseId();
    if (!id) return;
    this.loading.set(true);
    this.error.set(null);
    this.gradebook.getCourseGradebook(id).subscribe({
      next: b => { this.book.set(b); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e)); this.loading.set(false); },
    });
  }

  calculate() {
    const id = this.courseId();
    if (!id) return;
    this.message.set(null);
    this.gradebook.calculateFinalGrades(id).subscribe({
      next: r => this.message.set(`Final grades updated for ${r.updatedEnrollmentGrades} of ${r.enrolledStudents} students (${r.pendingIncomplete} incomplete).`),
      error: e => this.error.set(problemMessage(e)),
    });
  }
}
