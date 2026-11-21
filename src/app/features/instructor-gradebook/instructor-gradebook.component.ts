import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { GradebookService } from '../../services/gradebook.service';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentSubmission } from '../../models/assessment.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InstructorAssessment, InstructorCourse } from '../../models/instructor.model';
import { CourseGradebook } from '../../models/gradebook.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-gradebook',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './instructor-gradebook.component.html',
  styleUrl: './instructor-gradebook.component.scss',
})
export class InstructorGradebookComponent {
  private instructor = inject(InstructorService);
  private gradebook = inject(GradebookService);
  private assessmentApi = inject(AssessmentService);
  private route = inject(ActivatedRoute);
  courses = signal<InstructorCourse[]>([]);
  assessments = signal<InstructorAssessment[]>([]);
  submissionStats = signal<Record<number, { submitted: number; graded: number; pending: number }>>({});
  courseId = signal<number | undefined>(undefined);
  book = signal<CourseGradebook | null>(null);
  loading = signal(false);
  courseLoading = signal(false);
  assessmentLoading = signal(false);
  calculating = signal(false);
  publishingId = signal<number | null>(null);
  error = signal<string | null>(null);
  message = signal<string | null>(null);
  private loadVersion = 0;

  studentCount() {
    return new Set(this.book()?.grades.map(g => g.studentId) ?? []).size;
  }

  constructor() {
    this.courseLoading.set(true);
    this.instructor.getCourses().subscribe({
      next: courses => {
        this.courses.set(courses);
        this.courseLoading.set(false);
        const requestedId = Number(this.route.snapshot.queryParamMap.get('courseId'));
        if (requestedId && courses.some(c => c.id === requestedId)) {
          this.courseId.set(requestedId);
          this.load();
        }
      },
      error: e => { this.courseLoading.set(false); this.error.set(problemMessage(e, 'Unable to load your courses.')); },
    });
  }

  onCourse(value: string) {
    const id = value ? Number(value) : undefined;
    this.courseId.set(id && Number.isFinite(id) ? id : undefined);
    this.book.set(null);
    this.assessments.set([]);
    this.submissionStats.set({});
    this.message.set(null);
    this.error.set(null);
    if (this.courseId()) this.load();
  }

  load() {
    const id = this.courseId();
    if (!id) return;
    const version = ++this.loadVersion;
    this.loading.set(true);
    this.assessmentLoading.set(true);
    this.error.set(null);
    this.gradebook.getCourseGradebook(id).subscribe({
      next: book => { if (version !== this.loadVersion) return; this.book.set(book); this.loading.set(false); },
      error: e => { if (version !== this.loadVersion) return; this.error.set(problemMessage(e, 'Unable to load the course gradebook.')); this.loading.set(false); },
    });
    this.instructor.getAssessments(id).subscribe({
      next: rows => {
        if (version !== this.loadVersion) return;
        this.assessments.set(rows);
        if (!rows.length) {
          this.submissionStats.set({});
          this.assessmentLoading.set(false);
          return;
        }
        forkJoin(rows.map(a => this.assessmentApi.submissions(id, a.id).pipe(catchError(() => of([] as AssessmentSubmission[]))))).subscribe({
          next: submissionLists => {
            if (version !== this.loadVersion) return;
            const stats: Record<number, { submitted: number; graded: number; pending: number }> = {};
            rows.forEach((a, index) => {
              const submissions = submissionLists[index] ?? [];
              const latestByStudent = new Map<number, AssessmentSubmission>();
              [...submissions].sort((x, y) => new Date(y.submittedAt).getTime() - new Date(x.submittedAt).getTime())
                .forEach(submission => { if (!latestByStudent.has(submission.studentId)) latestByStudent.set(submission.studentId, submission); });
              const latest = [...latestByStudent.values()];
              const graded = latest.filter(x => x.gradingStatus === 'Graded' && x.score !== null).length;
              stats[a.id] = { submitted: latest.length, graded, pending: latest.length - graded };
            });
            this.submissionStats.set(stats);
            this.assessmentLoading.set(false);
          },
          error: () => { if (version === this.loadVersion) this.assessmentLoading.set(false); },
        });
      },
      error: e => { if (version !== this.loadVersion) return; this.assessmentLoading.set(false); this.error.set(problemMessage(e, 'Unable to load course assessments.')); },
    });
  }

  publish(assessment: InstructorAssessment) {
    const courseId = this.courseId();
    if (!courseId || assessment.status !== 'Published' || (this.submissionStats()[assessment.id]?.graded ?? 0) === 0 || this.publishingId() !== null) return;
    this.publishingId.set(assessment.id);
    this.message.set(null);
    this.error.set(null);
    this.gradebook.publishAssessmentGrades(courseId, assessment.id).subscribe({
      next: result => {
        this.publishingId.set(null);
        this.message.set(`Published ${result.publishedCount} student grade${result.publishedCount === 1 ? '' : 's'} for ${assessment.title}.`);
        this.load();
      },
      error: e => {
        this.publishingId.set(null);
        this.error.set(problemMessage(e, `Unable to publish grades for ${assessment.title}. Ensure the assessment is published and has fully graded submissions.`));
      },
    });
  }

  calculate() {
    const id = this.courseId();
    if (!id || this.calculating()) return;
    this.calculating.set(true);
    this.message.set(null);
    this.error.set(null);
    this.gradebook.calculateFinalGrades(id).subscribe({
      next: result => {
        this.calculating.set(false);
        this.message.set(`Final grades updated for ${result.updatedEnrollmentGrades} of ${result.enrolledStudents} students. ${result.pendingIncomplete} students still have incomplete published grades.`);
      },
      error: e => { this.calculating.set(false); this.error.set(problemMessage(e, 'Unable to calculate final grades. Check that published assessment weights total exactly 100%.')); },
    });
  }
}
