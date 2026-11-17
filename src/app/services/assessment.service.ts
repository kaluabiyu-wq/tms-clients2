import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Assessment, AssessmentAttempt, AssessmentDraft, AssessmentQuestion, AssessmentSubmission, StudentAssessment } from '../models/assessment.model';

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl.replace(/\/v1$/, '/v2');

  list(courseId: number) {
    return this.http.get<{ data: Assessment[] }>(`${this.api}/courses/${courseId}/assessments`);
  }
  get(courseId: number, assessmentId: number) {
    return this.http.get<Assessment>(`${this.api}/courses/${courseId}/assessments/${assessmentId}`);
  }
  private toWire(draft: AssessmentDraft) {
    const asUtc = (value: string | null) => value ? new Date(value).toISOString() : null;
    return { ...draft, opensAt: asUtc(draft.opensAt), closesAt: asUtc(draft.closesAt) };
  }
  create(courseId: number, draft: AssessmentDraft) {
    return this.http.post<Assessment>(`${this.api}/courses/${courseId}/assessments`, this.toWire(draft));
  }
  update(courseId: number, id: number, draft: AssessmentDraft) {
    return this.http.put<Assessment>(`${this.api}/courses/${courseId}/assessments/${id}`, this.toWire(draft));
  }
  addQuestion(courseId: number, id: number, question: Omit<AssessmentQuestion, 'id'> & { correctAnswer?: string | null }) {
    return this.http.post<AssessmentQuestion>(`${this.api}/courses/${courseId}/assessments/${id}/questions`, question);
  }
  publish(courseId: number, id: number) {
    return this.http.post<void>(`${this.api}/courses/${courseId}/assessments/${id}/publish`, {});
  }
  submissions(courseId: number, id: number) {
    return this.http.get<AssessmentSubmission[]>(`${this.api}/courses/${courseId}/assessments/${id}/submissions`);
  }
  studentAssessment(id: number) {
    return this.http.get<StudentAssessment>(`${this.api}/assessments/${id}`);
  }
  start(id: number) {
    return this.http.post<AssessmentAttempt>(`${this.api}/assessments/${id}/start`, {});
  }
  getAttempt(attemptId: number) {
    return this.http.get<AssessmentAttempt & { answers: { questionId: number; answerText: string }[] }>(`${this.api}/attempts/${attemptId}`);
  }
  saveAnswers(attemptId: number, answers: { questionId: number; answerText: string }[]) {
    return this.http.put<void>(`${this.api}/attempts/${attemptId}/answers`, { answers });
  }
  grade(courseId: number, assessmentId: number, submissionId: number, answers: { questionId: number; awardedPoints: number }[], feedback: string) {
    return this.http.put(`${this.api}/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}/grade`, { answers, feedback });
  }
  submit(attemptId: number) {
    return this.http.post<{ id: number; submittedAt: string; score: number | null; gradingStatus: string }>(`${this.api}/attempts/${attemptId}/submit`, {});
  }
}
