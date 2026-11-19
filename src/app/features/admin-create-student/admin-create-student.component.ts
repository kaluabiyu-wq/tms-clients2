import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUsersService } from '../../services/admin-users.service';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-admin-create-student',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page">
      <h1>Create student account</h1>
      <p class="hint">Creates a student login and its student record. The student signs in at /student/login.</p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          <label>First name<input formControlName="firstName" /></label>
          <label>Last name<input formControlName="lastName" /></label>
        </div>
        <label>Email<input type="email" formControlName="email" autocomplete="off" /></label>
        <label>Temporary password<input type="text" formControlName="password" autocomplete="off" />
          <span class="hint">At least 12 characters with an uppercase letter, a number and a symbol.</span></label>
        <label>Registration number <span class="hint">(optional, auto-generated if empty)</span>
          <input formControlName="registrationNumber" placeholder="STU-0041" /></label>
        @if (error()) { <p role="alert" class="err">{{ error() }}</p> }
        @if (success()) { <p class="ok">{{ success() }}</p> }
        <button type="submit" [disabled]="form.invalid || submitting()">{{ submitting() ? 'Creating…' : 'Create student' }}</button>
      </form>
    </section>
  `,
  styles: [`
    .page{padding:1.5rem;max-width:560px}form{display:grid;gap:.9rem;margin-top:1rem}
    label{display:grid;gap:.3rem;font-weight:600;font-size:.9rem}
    input{padding:.6rem;border:1px solid #cfd4dc;border-radius:7px;font:inherit}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:.9rem}
    button{padding:.7rem 1rem;border:0;border-radius:7px;background:#2457a7;color:#fff;cursor:pointer;font:inherit}
    button:disabled{opacity:.6;cursor:not-allowed}.err{color:#a32121}.ok{color:#18794e}.hint{color:#667085;font-weight:400}
  `],
})
export class AdminCreateStudentComponent {
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
    registrationNumber: [''],
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.error.set(null); this.success.set(null);
    const v = this.form.getRawValue();
    this.api.createStudent({ ...v, registrationNumber: v.registrationNumber.trim() || null }).subscribe({
      next: r => {
        this.submitting.set(false);
        this.success.set(`Student ${r.email} created (${r.registrationNumber}).`);
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
