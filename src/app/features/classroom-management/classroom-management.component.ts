import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Classroom } from '../../models/classroom.model';
import { ClassroomService } from '../../services/classroom.service';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-classroom-management',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './classroom-management.component.html',
  styleUrl: './classroom-management.component.scss',
})
export class ClassroomManagementComponent {
  private service = inject(ClassroomService);
  private fb = inject(FormBuilder);

  classrooms = signal<Classroom[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  togglingId = signal<number | null>(null);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    location: ['', [Validators.maxLength(200)]],
    capacity: [10, [Validators.required, Validators.min(1), Validators.max(1000)]],
  });

  constructor() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.list().subscribe({
      next: (page) => {
        this.classrooms.set(page.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(problemMessage(err, 'Failed to load classrooms.'));
        this.isLoading.set(false);
      },
    });
  }

  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    this.service.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.form.reset({ name: '', location: '', capacity: 10 });
        this.load();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.error.set(problemMessage(err, 'Failed to create the classroom.'));
      },
    });
  }

  toggleActive(room: Classroom) {
    this.togglingId.set(room.id);
    this.error.set(null);

    this.service
      .update(room.id, {
        name: room.name,
        location: room.location,
        capacity: room.capacity,
        isActive: !room.isActive,
      })
      .subscribe({
        next: (updated) => {
          this.classrooms.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
          this.togglingId.set(null);
        },
        error: (err) => {
          this.togglingId.set(null);
          this.error.set(problemMessage(err, 'Failed to update the classroom.'));
        },
      });
  }
}
