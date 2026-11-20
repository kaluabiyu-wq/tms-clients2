import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { StudentProfileService } from '../../services/student-profile.service';
import { Course } from '../../models/course.model';
import { StudentFullProfile } from '../../models/student-profile.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.scss',
})
export class EnrollmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly coursesApi = inject(CourseService);
  private readonly profileApi = inject(StudentProfileService);
  private readonly destroyRef = inject(DestroyRef);

  readonly profile = signal<StudentFullProfile | null>(null);
  readonly courses = signal<Course[]>([]);
  readonly loading = signal(true);
  readonly coursesLoading = signal(true);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly loadError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    courseId: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.loadStudentProfile();
    this.loadCourses();
  }

  private loadStudentProfile(): void {
    this.profileApi.getMyProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: profile => {
          this.profile.set(profile);
          this.loading.set(false);
        },
        error: error => {
          this.loading.set(false);
          this.loadError.set(
            error?.error?.detail ??
            'We could not load your student profile. Please contact the administrator.',
          );
        },
      });
  }

  private loadCourses(): void {
    this.coursesApi.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: courses => {
          this.courses.set(courses);
          this.coursesLoading.set(false);
        },
        error: () => {
          this.coursesLoading.set(false);
          this.loadError.set('Unable to load available courses. Please refresh and try again.');
        },
      });
  }

  get availableCourses(): Course[] {
    const enrolledIds = new Set(
      (this.profile()?.enrollments ?? []).map(enrollment => enrollment.courseId),
    );
    return this.courses().filter(course =>
      course.maxCapacity > course.enrollmentCount && !enrolledIds.has(course.id),
    );
  }

  get selectedCourse(): Course | undefined {
    return this.courses().find(course => course.id === this.form.controls.courseId.value);
  }

  submit(): void {
    const student = this.profile()?.student;
    const course = this.selectedCourse;

    if (!student) {
      this.submitError.set('Your student profile is not available. Please contact the administrator.');
      return;
    }

    if (this.form.invalid || !course) {
      this.form.markAllAsTouched();
      this.submitError.set('Please select an available course.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.coursesApi.enroll(course.id, { studentId: student.registrationNumber })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => this.submitted.set(true),
        error: error => this.submitError.set(
          error?.error?.detail ??
          error?.error?.message ??
          problemMessage(error) ??
          'Enrollment could not be submitted. Please try again.',
        ),
      });
  }
}
