import { Component, inject, signal } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
  private route = inject(ActivatedRoute);

  /** Set by /student/login, /instructor/login and /admin/login; undefined on the generic /login. */
  expectedRole: string | undefined = this.route.snapshot.data['expectedRole'];
  portalTitle = this.expectedRole ? `${this.expectedRole} sign in` : 'Welcome back';

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
        const role = this.auth.currentUser()?.role;

        if (this.expectedRole && role !== this.expectedRole) {
          this.auth.logout();
          this.loginError.set(`This account is not a ${this.expectedRole} account. Use the correct sign-in page.`);
          return;
        }

        switch (role) {
          case 'Instructor': this.router.navigate(['/instructor/dashboard']); break;
          case 'Student': this.router.navigate(['/student/dashboard']); break;
          case 'Admin': this.router.navigate(['/admin/dashboard']); break;
          default:
            this.auth.logout();
            this.loginError.set('Your account role is not authorized for this portal.');
        }
      })
      .catch((err) => {
        this.submitting.set(false);
        this.loginError.set(err?.error?.detail ?? 'Login failed. Please try again.');
      });
  }
}