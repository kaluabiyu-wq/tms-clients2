import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseAttendanceSummary, TrainingSession } from '../../../models/attendance.model';
import { Course } from '../../../models/course.model';
import { AttendanceService } from '../../../services/attendance.service';
import { CourseService } from '../../../services/course.service';
import { problemMessage } from '../../../util/problem-message';

/** Group-level rule: the session must end after it starts. */
function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startAt')?.value as string;
  const end = group.get('endAt')?.value as string;
  if (!start || !end) return null;
  return new Date(end).getTime() > new Date(start).getTime() ? null : { endBeforeStart: true };
}

@Component({
  selector: 'app-session-management',
  imports: [ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './session-management.component.html',
  styleUrl: './session-management.component.scss',
})
export class SessionManagementComponent {
  private attendance = inject(AttendanceService);
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);

  courses = signal<Course[]>([]);
  courseId = signal<number | null>(null);
  sessions = signal<TrainingSession[]>([]);
  summary = signal<CourseAttendanceSummary | null>(null);

  isLoadingCourses = signal(false);
  isLoadingCourse = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      topic: ['', [Validators.required, Validators.maxLength(200)]],
      startAt: ['', Validators.required],
      endAt: ['', Validators.required],
    },
    { validators: endAfterStart },
  );

  constructor() {
    this.loadCourses();
  }

  private loadCourses() {
    this.isLoadingCourses.set(true);
    this.courseService.getAll().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoadingCourses.set(false);
      },
      error: (err) => {
        this.error.set(problemMessage(err, 'Failed to load courses.'));
        this.isLoadingCourses.set(false);
      },
    });
  }

  selectCourse(value: string) {
    const id = value ? Number(value) : null;
    this.courseId.set(id);
    this.sessions.set([]);
    this.summary.set(null);
    this.error.set(null);
    if (id !== null) this.loadCourse(id);
  }

  /** Sessions and the percentage summary are independent reads, so they load in parallel. */
  private loadCourse(id: number) {
    this.isLoadingCourse.set(true);

    this.attendance.listSessions(id).subscribe({
      next: (page) => {
        this.sessions.set(page.items);
        this.isLoadingCourse.set(false);
      },
      error: (err) => {
        this.error.set(problemMessage(err, 'Failed to load sessions.'));
        this.isLoadingCourse.set(false);
      },
    });

    this.attendance.getCourseSummary(id).subscribe({
      next: (summary) => this.summary.set(summary),
      error: (err) => this.error.set(problemMessage(err, 'Failed to load the attendance summary.')),
    });
  }

  createSession() {
    const id = this.courseId();
    if (id === null) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { topic, startAt, endAt } = this.form.getRawValue();
    this.isSaving.set(true);
    this.error.set(null);

    // <input type="datetime-local"> yields the user's LOCAL wall-clock time without a zone;
    // new Date(...).toISOString() converts it to UTC, which is what the API stores (see API-STANDARDS).
    this.attendance
      .createSession({
        courseId: id,
        topic,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.form.reset({ topic: '', startAt: '', endAt: '' });
          this.loadCourse(id);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.error.set(problemMessage(err, 'Failed to create the session.'));
        },
      });
  }
}
