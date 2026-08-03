import { Component, DestroyRef, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CourseService } from "../../services/course.service";

@Component({
  selector: "app-enrollment-form",
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: "./enrollment-form.component.html",
})
export class EnrollmentFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(CourseService);
  private destroyRef = inject(DestroyRef);

 
  submitted = signal(false);
  submitting = signal(false);
  submitError = signal<string | null>(null);

  
  form = this.fb.nonNullable.group({
    studentId: [
      "",
      [Validators.required, Validators.pattern("^STU-[0-9]{4}$")],
    ],
    
    courseId: ["", Validators.required],
    term: ["Fall 2026", Validators.required],
    notes: [""], 
    backupCourses: this.fb.array<FormControl<string>>([]), 
  });

  
  get backups() {
    return this.form.controls.backupCourses;
  }

  addBackup() {
    this.backups.push(
      this.fb.control("", {
        nonNullable: true,
        validators: Validators.required,
      }),
    );
  }

  removeBackup(index: number) {
    this.backups.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
     
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const courseId = Number(raw.courseId);

    if (!Number.isFinite(courseId)) {
      this.submitError.set("Course ID must be a number.");
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.api
      .enroll(courseId, { studentId: raw.studentId })
         .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: (err) => {
          this.submitting.set(false);
           this.submitError.set(
            err?.error?.message ?? "Enrollment failed. Please try again.",
          );
        },
      });
  }
}