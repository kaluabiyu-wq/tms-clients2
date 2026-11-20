import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { AssessmentService } from '../../services/assessment.service';
import { Course } from '../../models/course.model';
import { Assessment, AssessmentSubmission } from '../../models/assessment.model';

@Component({
  selector: 'tms-grade-submission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grade-submission.component.html',
  styleUrl: './grade-submission.component.scss',
})
export class GradeSubmissionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coursesApi = inject(CourseService);
  private readonly assessmentsApi = inject(AssessmentService);

  courses: Course[] = [];
  assessments: Assessment[] = [];
  submissions: AssessmentSubmission[] = [];
  selectedSubmission: AssessmentSubmission | null = null;
  loadingCourses = false;
  loadingAssessments = false;
  loadingSubmissions = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  selectionForm = this.fb.group({
    courseId: [null as number | null, Validators.required],
    assessmentId: [null as number | null, Validators.required],
    submissionId: [null as number | null, Validators.required],
  });

  gradingForm = this.fb.group({
    feedback: [''],
    answers: this.fb.array([]),
  });

  get answerControls(): FormArray {
    return this.gradingForm.controls.answers as FormArray;
  }

  get maximumTotalPoints(): number {
    return this.selectedSubmission?.answers.reduce((total, answer) => total + answer.points, 0) ?? 0;
  }

  async ngOnInit(): Promise<void> {
    this.loadingCourses = true;
    this.errorMessage = '';
    try {
      this.courses = await firstValueFrom(this.coursesApi.getAll());
    } catch (error: any) {
      this.errorMessage = this.readError(error, 'Could not load courses.');
    } finally {
      this.loadingCourses = false;
    }
  }

  async onCourseChange(): Promise<void> {
    const courseId = Number(this.selectionForm.controls.courseId.value);
    this.assessments = [];
    this.submissions = [];
    this.clearSelectedSubmission();
    this.selectionForm.controls.assessmentId.setValue(null);
    this.selectionForm.controls.submissionId.setValue(null);
    if (!courseId) return;

    this.loadingAssessments = true;
    this.errorMessage = '';
    try {
      const response = await firstValueFrom(this.assessmentsApi.list(courseId));
      this.assessments = (response as any).data ?? [];
    } catch (error: any) {
      this.errorMessage = this.readError(error, 'Could not load assessments for this course.');
    } finally {
      this.loadingAssessments = false;
    }
  }

  async onAssessmentChange(): Promise<void> {
    const courseId = Number(this.selectionForm.controls.courseId.value);
    const assessmentId = Number(this.selectionForm.controls.assessmentId.value);
    this.submissions = [];
    this.clearSelectedSubmission();
    this.selectionForm.controls.submissionId.setValue(null);
    if (!courseId || !assessmentId) return;

    this.loadingSubmissions = true;
    this.errorMessage = '';
    try {
      this.submissions = await firstValueFrom(this.assessmentsApi.submissions(courseId, assessmentId));
    } catch (error: any) {
      this.errorMessage = this.readError(error, 'Could not load student submissions.');
    } finally {
      this.loadingSubmissions = false;
    }
  }

  onSubmissionChange(): void {
    const submissionId = Number(this.selectionForm.controls.submissionId.value);
    this.selectedSubmission = this.submissions.find(s => s.id === submissionId) ?? null;
    this.answerControls.clear();
    this.gradingForm.controls.feedback.setValue(this.selectedSubmission?.feedback ?? '');

    if (!this.selectedSubmission) return;
    for (const answer of this.selectedSubmission.answers) {
      this.answerControls.push(this.fb.group({
        questionId: [answer.questionId, Validators.required],
        awardedPoints: [
          answer.awardedPoints ?? 0,
          [Validators.required, Validators.min(0), Validators.max(answer.points)],
        ],
      }));
    }
  }

  async submitGrades(): Promise<void> {
    if (!this.selectedSubmission || this.gradingForm.invalid || this.isSubmitting) {
      this.gradingForm.markAllAsTouched();
      return;
    }

    const courseId = Number(this.selectionForm.controls.courseId.value);
    const assessmentId = Number(this.selectionForm.controls.assessmentId.value);
    const answers = this.answerControls.getRawValue().map((a: any) => ({
      questionId: Number(a.questionId),
      awardedPoints: Number(a.awardedPoints),
    }));

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    try {
      await firstValueFrom(this.assessmentsApi.grade(
        courseId,
        assessmentId,
        this.selectedSubmission.id,
        answers,
        this.gradingForm.controls.feedback.value ?? '',
      ));
      this.successMessage = 'Grades saved successfully.';
      this.submissions = await firstValueFrom(this.assessmentsApi.submissions(courseId, assessmentId));
      const refreshed = this.submissions.find(s => s.id === Number(this.selectionForm.controls.submissionId.value));
      if (refreshed) {
        this.selectedSubmission = refreshed;
        this.onSubmissionChange();
      }
    } catch (error: any) {
      this.errorMessage = this.readError(error, 'Grade submission failed.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private clearSelectedSubmission(): void {
    this.selectedSubmission = null;
    this.answerControls.clear();
    this.gradingForm.controls.feedback.setValue('');
  }

  private readError(error: any, fallback: string): string {
    return error?.error?.message ?? error?.error?.detail ?? error?.message ?? fallback;
  }
}
