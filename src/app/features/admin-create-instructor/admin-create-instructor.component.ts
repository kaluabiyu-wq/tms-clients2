import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUsersService } from '../../services/admin-users.service';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-admin-create-instructor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-create-instructor.component.html',
  styleUrl: './admin-create-instructor.component.scss',
})
export class AdminCreateInstructorComponent {
  private fb = inject(FormBuilder);
  private api = inject(AdminUsersService);
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    department: [''],
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.error.set(null); this.success.set(null);
    const v = this.form.getRawValue();
    this.api.createInstructor({ ...v, department: v.department.trim() || null }).subscribe({
      next: r => {
        this.submitting.set(false);
        this.success.set(`Instructor ${r.email} created.`);
        this.form.reset();
      },
      error: e => {
        this.submitting.set(false);
        const list = e?.error?.errors;
        this.error.set(Array.isArray(list) && list.length ? list.join(' ') : problemMessage(e));
      },
    });
  }
}
