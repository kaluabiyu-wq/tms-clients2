import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentAttempt, StudentAssessment } from '../../models/assessment.model';

@Component({ selector:'app-examination', standalone:true, imports:[CommonModule, FormsModule, RouterLink], templateUrl:'./examination.component.html' })
export class ExaminationComponent {
  private readonly route=inject(ActivatedRoute); private readonly service=inject(AssessmentService);
  readonly assessmentId=Number(this.route.snapshot.paramMap.get('assessmentId'));
  readonly assessment=signal<StudentAssessment|null>(null); readonly attempt=signal<AssessmentAttempt|null>(null);
  readonly answers=signal<Record<number,string>>({}); readonly message=signal(''); readonly busy=signal(false);
  async ngOnInit() {
    try {
      this.assessment.set(await firstValueFrom(this.service.studentAssessment(this.assessmentId)));
      const started = await firstValueFrom(this.service.start(this.assessmentId));
      const attempt = await firstValueFrom(this.service.getAttempt(started.id));
      this.attempt.set(attempt);
      this.answers.set(Object.fromEntries(attempt.answers.map(a=>[a.questionId,a.answerText])));
    } catch(e:any) { this.message.set(e?.error?.detail ?? e?.error?.message ?? 'Unable to start this examination.'); }
  }
  setAnswer(id:number,value:string) { this.answers.update(a=>({...a,[id]:value})); }
  async saveAndSubmit() {
    const attempt=this.attempt(); if(!attempt || this.busy()) return;
    this.busy.set(true);
    try {
      const answers=Object.entries(this.answers()).map(([questionId,answerText])=>({questionId:Number(questionId),answerText}));
      await firstValueFrom(this.service.saveAnswers(attempt.id,answers));
      const result=await firstValueFrom(this.service.submit(attempt.id));
      this.message.set(result.gradingStatus==='Graded' ? `Submitted. Your score is ${result.score}.` : 'Submitted. Your answers require instructor grading.');
      this.attempt.set({...attempt,status:'Submitted'});
    } catch(e:any) { this.message.set(e?.error?.detail ?? e?.error?.message ?? 'Submission failed.'); }
    finally { this.busy.set(false); }
  }
}
