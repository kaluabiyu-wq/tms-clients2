import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProgramService } from '../../services/program.service';
import { StudentProgramProgress } from '../../models/program.model';

@Component({ selector: 'app-student-progress', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './student-progress.component.html', styleUrl: './student-progress.component.scss' })
export class StudentProgressComponent {
  private readonly api=inject(ProgramService); private readonly route=inject(ActivatedRoute);
  readonly progress=signal<StudentProgramProgress[]>([]); readonly loading=signal(false); readonly error=signal('');
  studentId=Number(this.route.snapshot.paramMap.get('studentId'))||0; programId=Number(this.route.snapshot.paramMap.get('id'))||0;
  constructor(){if(this.route.snapshot.routeConfig?.path==='my-progress')this.loadMine();else if(this.studentId)this.loadStudent();else if(this.programId)this.loadProgram();}
  loadStudent():void{if(this.studentId<1){this.error.set('Enter a valid student ID.');return;}this.loading.set(true);this.error.set('');this.api.getStudentProgress(this.studentId).pipe(finalize(()=>this.loading.set(false))).subscribe({next:x=>this.progress.set(x),error:e=>this.error.set(e?.error?.message??'Unable to load student progress.')});}
  loadMine():void{this.loading.set(true);this.api.getMyProgress().pipe(finalize(()=>this.loading.set(false))).subscribe({next:x=>this.progress.set(x),error:e=>this.error.set(e?.error?.message??'Unable to load your progress.')});}
  loadProgram():void{this.loading.set(true);this.api.getProgramProgress(this.programId).pipe(finalize(()=>this.loading.set(false))).subscribe({next:x=>this.progress.set(x),error:e=>this.error.set(e?.error?.message??'Unable to load program progress.')});}
}
