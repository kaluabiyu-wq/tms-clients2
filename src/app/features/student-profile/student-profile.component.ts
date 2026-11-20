import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentProfileService } from '../../services/student-profile.service';
import { StudentFullProfile } from '../../models/student-profile.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss',
})
export class StudentProfileComponent {
  private service = inject(StudentProfileService);

  profile = signal<StudentFullProfile | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.service.getMyProfile().subscribe({
      next: p => { this.profile.set(p); this.loading.set(false); },
      error: e => {
        this.error.set(e?.error?.detail ?? problemMessage(e));
        this.loading.set(false);
      },
    });
  }

  initials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('');
  }
}
