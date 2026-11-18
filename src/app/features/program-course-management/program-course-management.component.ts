import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { ProgramService } from '../../services/program.service';
import { Course } from '../../models/course.model';
import { TrainingProgram } from '../../models/program.model';

@Component({ selector: 'app-program-course-management', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './program-course-management.component.html', styleUrl: './program-course-management.component.scss' })
export class ProgramCourseManagementComponent {
  private readonly route = inject(ActivatedRoute); private readonly programsApi = inject(ProgramService); private readonly coursesApi = inject(CourseService);
  readonly program = signal<TrainingProgram | null>(null); readonly courses = signal<Course[]>([]); readonly error = signal(''); readonly saving = signal(false);
  courseId = 0; sequence = 1; isRequired = true; private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  constructor() { this.load(); this.coursesApi.getAll().subscribe({ next: x => this.courses.set(x), error: () => this.error.set('Unable to load catalogue courses.') }); }
  load(): void { this.programsApi.getPrograms(true).subscribe({ next: xs => { this.program.set(xs.find(x => x.id === this.id) ?? null); if (!this.program()) this.error.set('Program not found.'); else this.sequence = this.program()!.courseCount + 1; }, error: () => this.error.set('Unable to load program.') }); }
  add(): void { this.error.set(''); if (!this.courseId || this.sequence < 1) { this.error.set('Choose a course and a valid sequence number.'); return; } this.saving.set(true); this.programsApi.addCourse(this.id,{courseId:this.courseId,sequence:this.sequence,isRequired:this.isRequired}).pipe(finalize(()=>this.saving.set(false))).subscribe({next:p=>{this.program.set(p);this.courseId=0;this.sequence=(p.courseCount??0)+1;},error:e=>this.error.set(e?.error?.message??'Could not add course.'),complete:()=>this.saving.set(false)}); }
}
