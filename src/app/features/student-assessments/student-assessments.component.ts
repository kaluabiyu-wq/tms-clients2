import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../models/assessment.model';

@Component({ selector:'app-student-assessments', standalone:true, imports:[CommonModule,RouterLink], templateUrl:'./student-assessments.component.html',
  styleUrl: './student-assessments.component.scss',})
export class StudentAssessmentsComponent {
  private readonly route=inject(ActivatedRoute); private readonly service=inject(AssessmentService);
  readonly courseId=Number(this.route.snapshot.paramMap.get('courseId'));
  readonly assessments=signal<Assessment[]>([]); readonly error=signal('');
  async ngOnInit() {
    try { const response=await firstValueFrom(this.service.list(this.courseId)); this.assessments.set(response.data ?? []); }
    catch(e:any) { this.error.set(e?.error?.detail ?? 'Unable to load available assessments.'); }
  }
}
