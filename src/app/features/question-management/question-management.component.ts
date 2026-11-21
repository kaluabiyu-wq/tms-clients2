import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../models/assessment.model';

@Component({ selector:'app-question-management', standalone:true, imports:[CommonModule, FormsModule, RouterLink], templateUrl:'./question-management.component.html',
  styleUrl: './question-management.component.scss',})
export class QuestionManagementComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AssessmentService);
  readonly courseId = Number(this.route.snapshot.paramMap.get('courseId'));
  readonly assessmentId = Number(this.route.snapshot.paramMap.get('assessmentId'));
  readonly assessment = signal<Assessment | null>(null);
  readonly error = signal('');
  readonly prompt = signal('');
  readonly type = signal<'MultipleChoice'|'TrueFalse'|'ShortAnswer'|'Essay'>('MultipleChoice');
  readonly options = signal('Option A\nOption B');
  readonly correctAnswer = signal('');
  readonly points = signal(1);
  async ngOnInit() { try { this.assessment.set(await firstValueFrom(this.service.get(this.courseId, this.assessmentId))); } catch { this.error.set('Could not load assessment.'); } }
  async add() {
    const opts = this.type() === 'MultipleChoice' ? this.options().split('\n').map(x=>x.trim()).filter(Boolean) : this.type() === 'TrueFalse' ? ['True','False'] : null;
    try {
      await firstValueFrom(this.service.addQuestion(this.courseId, this.assessmentId, {
        prompt:this.prompt(), questionType:this.type(), options:opts, correctAnswer:this.type()==='Essay'?null:this.correctAnswer(),
        points:this.points(), sortOrder:this.assessment()?.questions?.length ?? 0
      }));
      this.prompt.set(''); this.correctAnswer.set('');
      this.assessment.set(await firstValueFrom(this.service.get(this.courseId, this.assessmentId)));
    } catch (e:any) { this.error.set(e?.error?.detail ?? e?.error?.message ?? 'Unable to add question.'); }
  }
}
