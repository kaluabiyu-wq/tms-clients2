import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProgramService } from '../../services/program.service';
import { StudentProgramProgress } from '../../models/program.model';

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-progress.component.html',
  styleUrl: './student-progress.component.scss',
})
export class StudentProgressComponent {
  private readonly api = inject(ProgramService);
  private readonly route = inject(ActivatedRoute);

  readonly isMyProgress = this.route.snapshot.routeConfig?.path === 'my-progress';
  readonly progress = signal<StudentProgramProgress[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly totalPrograms = computed(() => this.progress().length);
  readonly completedCourses = computed(() => this.progress().reduce((sum, item) => sum + item.completedCourses, 0));
  readonly remainingCourses = computed(() => this.progress().reduce((sum, item) => sum + item.remainingCourses, 0));
  readonly overallCompletion = computed(() => {
    const items = this.progress();
    const total = items.reduce((sum, item) => sum + item.totalCourses, 0);
    if (!total) return 0;
    return Math.round(items.reduce((sum, item) => sum + item.completedCourses, 0) * 100 / total);
  });

  studentId = Number(this.route.snapshot.paramMap.get('studentId')) || 0;
  programId = Number(this.route.snapshot.paramMap.get('id')) || 0;

  constructor() {
    if (this.isMyProgress) this.loadMine();
    else if (this.studentId) this.loadStudent();
    else if (this.programId) this.loadProgram();
  }

  loadStudent(): void {
    if (this.studentId < 1) {
      this.error.set('Enter a valid student ID.');
      return;
    }
    this.fetch(() => this.api.getStudentProgress(this.studentId), 'Unable to load student progress.');
  }

  loadMine(): void {
    // The API resolves the student from the authenticated account. Never use a
    // student ID supplied by the browser for the student's own progress page.
    this.fetch(() => this.api.getMyProgress(), 'Unable to load your progress.');
  }

  loadProgram(): void {
    this.fetch(() => this.api.getProgramProgress(this.programId), 'Unable to load program progress.');
  }

  private fetch(request: () => ReturnType<ProgramService['getMyProgress']>, fallback: string): void {
    this.loading.set(true);
    this.error.set('');
    request().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: result => this.progress.set(result ?? []),
      error: err => this.error.set(err?.error?.message ?? fallback),
    });
  }
}
