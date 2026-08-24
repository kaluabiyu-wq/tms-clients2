import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-course-list.component.html',
  styleUrl: './admin-course-list.component.scss',
})
export class AdminCourseListComponent {
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);

  
  courses = signal<Course[]>([]);

  isLoading = signal(false);
  error = signal<string | null>(null);

  // Which row (by course id) currently has its inline edit form open.
  // Only one row can be in edit mode at a time.
  editingId = signal<number | null>(null);
  savingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);

  editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
  });

  constructor() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading.set(true);
    this.error.set(null);

    this.courseService.getAll().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.detail ?? 'Failed to load courses.');
        this.isLoading.set(false);
      },
    });
  }

  startEdit(course: Course) {
    this.editingId.set(course.id);
    this.editForm.setValue({ title: course.title });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editForm.reset();
  }

   saveEdit(course: Course) {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const id = course.id;
    const { title } = this.editForm.getRawValue();
    this.savingId.set(id);
    this.error.set(null);

    this.courseService.update(id, { title }).subscribe({
      next: () => {
        this.courses.update((list) =>
          list.map((c) => (c.id === id ? { ...c, title } : c))
        );
        this.savingId.set(null);
        this.editingId.set(null);
      },
      error: (err) => {
        this.savingId.set(null);
        this.error.set(
          err?.status === 403
            ? "You don't have permission to edit this course."
            : (err?.error?.detail ?? 'Failed to save changes.')
        );
      },
    });
  }

  deleteCourse(course: Course) {
    const id = course.id;
    this.deletingId.set(id);
    this.error.set(null);

    this.courseService.delete(id).subscribe({
      next: () => {
        this.courses.update((list) => list.filter((c) => c.id !== id));
        this.deletingId.set(null);
      },
      error: (err) => {
        this.deletingId.set(null);
        this.error.set(err?.error?.detail ?? 'Failed to delete course.');
      },
    });
  }
}