import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { GradebookService } from '../../services/gradebook.service';
import { GradeAppeal, StudentGrade } from '../../models/gradebook.model';

@Component({
  selector: 'app-grade-appeals',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './grade-appeals.component.html',
  styleUrl: './grade-appeals.component.scss'
})
export class GradeAppealsComponent {
  private service = inject(GradebookService);

  readonly mode: 'student' | 'staff' =
    inject(ActivatedRoute).snapshot.data['mode'] === 'staff' ? 'staff' : 'student';

  readonly appeals = signal<GradeAppeal[]>([]);
  readonly publishedCourses = signal<StudentGrade[]>([]);
  readonly busy = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  // student form
  enrollmentId: number | null = null;
  reason = '';

  // staff review inputs per appeal id
  responses: Record<number, string> = {};

  // staff filter
  statusFilter = 'Pending';

  constructor() { void this.load(); }

  async load() {
    try {
      if (this.mode === 'student') {
        const [appeals, grades] = await Promise.all([
          firstValueFrom(this.service.getMyAppeals()),
          firstValueFrom(this.service.getMyGrades())
        ]);
        this.appeals.set(appeals);
        this.publishedCourses.set(grades.filter(g => g.finalGrade != null));
      } else {
        this.appeals.set(await firstValueFrom(
          this.service.getAppeals(this.statusFilter || undefined)));
      }
    } catch (e) {
      this.fail(e, 'Unable to load appeals.');
    }
  }

  async submit() {
    this.error.set(''); this.message.set('');

    if (!this.enrollmentId || this.reason.trim().length < 10) {
      this.error.set('Choose a course and explain your appeal (at least 10 characters).');
      return;
    }

    this.busy.set(true);
    try {
      await firstValueFrom(this.service.submitAppeal(this.enrollmentId, this.reason.trim()));
      this.reason = '';
      this.message.set('Your appeal was submitted.');
      await this.load();
    } catch (e) {
      this.fail(e, 'Unable to submit appeal.');
    } finally {
      this.busy.set(false);
    }
  }

  async review(appeal: GradeAppeal, status: 'UnderReview' | 'Approved' | 'Rejected') {
    this.error.set(''); this.message.set('');
    const response = this.responses[appeal.id]?.trim();

    if (status !== 'UnderReview' && !response) {
      this.error.set('A response is required to approve or reject.');
      return;
    }

    this.busy.set(true);
    try {
      await firstValueFrom(this.service.reviewAppeal(appeal.id, { status, response }));
      this.message.set(
        status === 'Approved'
          ? 'Appeal approved. Apply the grade change using "Correct" in the gradebook.'
          : 'Appeal updated.');
      await this.load();
    } catch (e) {
      this.fail(e, 'Unable to review appeal.');
    } finally {
      this.busy.set(false);
    }
  }

  private fail(e: unknown, fallback: string) {
    this.error.set((e as { error?: { detail?: string } })?.error?.detail ?? fallback);
  }
}