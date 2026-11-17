import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment, AssessmentDraft } from '../../models/assessment.model';

@Component({
  selector: 'app-assessment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './assessment-management.component.html'
})
export class AssessmentManagementComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AssessmentService);
  readonly courseId = Number(this.route.snapshot.paramMap.get('courseId'));
  readonly assessments = signal<Assessment[]>([]);
  readonly error = signal('');
  readonly busy = signal(false);
  draft: AssessmentDraft = { title: '', description: '', maxScore: 100, weight: 0,
    opensAt: null, closesAt: null, durationMinutes: 60, maxAttempts: 1 };
  constructor() { void this.reload(); }
  async reload() {
    try { const response = await firstValueFrom(this.service.list(this.courseId)); this.assessments.set(response.data ?? []); }
    catch { this.error.set('Unable to load assessments. Check course access and API availability.'); }
  }
  async create() {
    this.error.set('');
    if (!this.draft.title.trim() || this.courseId <= 0) { this.error.set('Enter a title and open this page from a valid course.'); return; }
    this.busy.set(true);
    try { await firstValueFrom(this.service.create(this.courseId, this.draft)); this.draft = { title:'', description:'', maxScore:100, weight:0, opensAt:null, closesAt:null, durationMinutes:60, maxAttempts:1 }; await this.reload(); }
    catch (e: any) { this.error.set(e?.error?.detail ?? e?.error?.message ?? 'Could not create assessment.'); }
    finally { this.busy.set(false); }
  }
  async publish(a: Assessment) {
    this.error.set('');
    try { await firstValueFrom(this.service.publish(this.courseId, a.id)); await this.reload(); }
    catch (e: any) { this.error.set(e?.error?.detail ?? e?.error?.message ?? 'Could not publish assessment.'); }
  }
}
