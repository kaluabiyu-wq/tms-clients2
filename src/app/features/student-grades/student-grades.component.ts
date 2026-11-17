import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { GradebookService } from '../../services/gradebook.service';
import { StudentGrade } from '../../models/gradebook.model';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './student-grades.component.html',
  styleUrl: './student-grades.component.scss'
})
export class StudentGradesComponent {
  private service = inject(GradebookService);

  readonly grades = signal<StudentGrade[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor() { void this.load(); }

  async load() {
    this.loading.set(true);
    this.error.set('');
    try {
      this.grades.set(await firstValueFrom(this.service.getMyGrades()));
    } catch {
      this.error.set('Unable to retrieve your grades.');
    } finally {
      this.loading.set(false);
    }
  }
}