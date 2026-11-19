import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const p = group.get('password')?.value;
  const c = group.get('confirm')?.value;
  return p && c && p !== c ? { mismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: '../login/login.component.scss',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // The emailed link carries ?email=...&token=...
  private email = this.route.snapshot.queryParamMap.get('email') ?? '';
  private token = this.route.snapshot.queryParamMap.get('token') ?? '';
  linkValid = !!this.email && !!this.token;

  submitting = signal(false);
  done = signal<string | null>(null);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(12)]],
      confirm: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.resetPassword(this.email, this.token, this.form.getRawValue().password)
      .then(r => {
        this.submitting.set(false);
        this.done.set(r.message);
        setTimeout(() => this.router.navigate(['/login']), 2500);
      })
      .catch(err => {
        this.submitting.set(false);
        const list = err?.error?.errors;
        this.error.set(Array.isArray(list) && list.length ? list.join(' ') : (err?.error?.detail ?? 'Could not reset the password.'));
      });
  }
}
