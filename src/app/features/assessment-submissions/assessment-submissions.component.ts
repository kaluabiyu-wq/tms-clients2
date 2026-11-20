import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentSubmission } from '../../models/assessment.model';

@Component({ selector:'app-assessment-submissions', standalone:true, imports:[CommonModule,FormsModule,RouterLink], templateUrl:'./assessment-submissions.component.html',
  styleUrl: './assessment-submissions.component.scss',})
export class AssessmentSubmissionsComponent {
  private readonly route=inject(ActivatedRoute); private readonly service=inject(AssessmentService);
  readonly courseId=Number(this.route.snapshot.paramMap.get('courseId'));
  readonly assessmentId=Number(this.route.snapshot.paramMap.get('assessmentId'));
  readonly submissions=signal<AssessmentSubmission[]>([]); readonly error=signal('');
  readonly grades=signal<Record<number,Record<number,number>>>({}); readonly feedback=signal<Record<number,string>>({});
  setGrade(submissionId:number, questionId:number, value:number) { this.grades.update(g=>({...g,[submissionId]:{...(g[submissionId]??{}),[questionId]:value}})); }
  setFeedback(submissionId:number, value:string) { this.feedback.update(f=>({...f,[submissionId]:value})); }
  async grade(s:AssessmentSubmission) {
    try {
      const answers=s.answers.map(a=>({questionId:a.questionId,awardedPoints:this.grades()[s.id]?.[a.questionId] ?? a.awardedPoints ?? 0}));
      await firstValueFrom(this.service.grade(this.courseId,this.assessmentId,s.id,answers,this.feedback()[s.id]??''));
      this.submissions.set(await firstValueFrom(this.service.submissions(this.courseId,this.assessmentId)));
    } catch(e:any) { this.error.set(e?.error?.detail ?? e?.error?.message ?? 'Grading failed.'); }
  }
  async ngOnInit() { try { this.submissions.set(await firstValueFrom(this.service.submissions(this.courseId,this.assessmentId))); }
    catch(e:any) { this.error.set(e?.error?.detail ?? 'Could not load submissions.'); } }
}
