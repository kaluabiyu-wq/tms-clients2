import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProgramService } from '../../services/program.service';
import { StudentProgramProgress, TrainingProgram } from '../../models/program.model';

@Component({ selector: 'app-student-program-enrollment', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './student-program-enrollment.component.html', styleUrl: './student-program-enrollment.component.scss' })
export class StudentProgramEnrollmentComponent {
  private readonly api=inject(ProgramService); private readonly route=inject(ActivatedRoute); readonly programs=signal<TrainingProgram[]>([]); readonly result=signal<StudentProgramProgress|null>(null); readonly error=signal(''); readonly saving=signal(false);
  studentId=0; programId=0;
  constructor(){this.programId=Number(this.route.snapshot.paramMap.get('id'))||0;this.api.getPrograms().subscribe({next:x=>this.programs.set(x),error:()=>this.error.set('Unable to load programs.')});}
  register():void{this.error.set('');if(this.studentId<1||this.programId<1){this.error.set('Enter a valid student ID and select a program.');return;}this.saving.set(true);this.api.registerStudent({studentId:this.studentId,programId:this.programId}).pipe(finalize(()=>this.saving.set(false))).subscribe({next:x=>this.result.set(x),error:e=>this.error.set(e?.error?.message??'Registration failed.')});}
}
