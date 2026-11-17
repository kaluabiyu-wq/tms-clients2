import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { GradebookService } from '../../services/gradebook.service';
import { AssessmentGradeItem, CourseGradebook, StudentGrade } from '../../models/gradebook.model';

@Component({
  selector: 'app-gradebook',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './gradebook.component.html',
  styleUrl: './gradebook.component.scss'
})
export class GradebookComponent {
  private service = inject(GradebookService);
  private route = inject(ActivatedRoute);

  readonly courseId = Number(this.route.snapshot.paramMap.get('courseId'));

  readonly gradebook = signal<CourseGradebook | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly message = signal('');

  // Pending inputs, keyed by "enrollmentId-assessmentId".
  scores: Record<string, number | null> = {};
  comments: Record<string, string> = {};

  constructor() { void this.load(); }

  key(s: StudentGrade, a: AssessmentGradeItem) { return `${s.enrollmentId}-${a.assessmentId}`; }

  async load() {
    this.loading.set(true);
    this.error.set('');
    try {
      const book = await firstValueFrom(this.service.getCourseGradebook(this.courseId));
      this.gradebook.set(book);
      this.scores = {};
      this.comments = {};
    } catch (e) {
      this.fail(e, 'Unable to load the course gradebook.');
    } finally {
      this.loading.set(false);
    }
  }

  async save(s: StudentGrade, a: AssessmentGradeItem) {
    const k = this.key(s, a);
    const score = this.scores[k];
    if (score == null) { this.error.set('Enter a score first.'); return; }

    await this.run(async () => {
      const feedback = this.comments[k]?.trim() || undefined;
      if (a.gradeRecordId) {
        await firstValueFrom(this.service.updateGrade(a.gradeRecordId, { score, feedback }));
      } else {
        await firstValueFrom(this.service.saveGrade({
          enrollmentId: s.enrollmentId, assessmentId: a.assessmentId, score, feedback
        }));
      }
      this.message.set('Grade saved.');
    });
  }

  async publishAssessment(a: AssessmentGradeItem) {
    if (!a.gradeRecordId) return;
    await this.run(async () => {
      await firstValueFrom(this.service.publishAssessmentGrade(a.gradeRecordId!));
      this.message.set('Assessment grade published.');
    });
  }

  async publishFinal(s: StudentGrade) {
    if (!confirm(`Publish the final grade for ${s.studentName}? This publishes all their assessment grades.`)) return;
    await this.run(async () => {
      await firstValueFrom(this.service.publishFinalGrade(s.enrollmentId));
      this.message.set('Final grade published.');
    });
  }

  async correct(a: AssessmentGradeItem) {
    if (!a.gradeRecordId) return;
    const raw = prompt(`New score for "${a.assessmentTitle}" (max ${a.maxScore}):`);
    if (raw === null) return;
    const newScore = Number(raw);
    const reason = prompt('Reason for the correction (required, min 10 characters):') ?? '';
    if (Number.isNaN(newScore)) { this.error.set('Invalid score.'); return; }

    await this.run(async () => {
      await firstValueFrom(this.service.correctGrade(a.gradeRecordId!, { newScore, reason }));
      this.message.set('Grade corrected and recorded in the history.');
    });
  }

  private async run(action: () => Promise<void>) {
    this.error.set('');
    this.message.set('');
    try {
      await action();
      await this.load();
    } catch (e) {
      this.fail(e, 'The operation failed.');
    }
  }

  private fail(e: unknown, fallback: string) {
    const detail = (e as { error?: { detail?: string } })?.error?.detail;
    this.error.set(detail ?? fallback);
  }
}