import { Component, inject, signal } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = signal(false);
  loginError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.loginError.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth.login({email, password})
      .then(() => {
        this.submitting.set(false);
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.submitting.set(false);
        this.loginError.set(err?.error?.detail ?? 'Login failed. Please try again.');
      });
  }
}