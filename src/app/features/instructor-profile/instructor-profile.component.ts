import { Component, inject, signal } from '@angular/core';
import { InstructorService } from '../../services/instructor.service';
import { InstructorProfile } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  templateUrl: './instructor-profile.component.html',
  styleUrl: './instructor-profile.component.scss',
})
export class InstructorProfileComponent {
  private service = inject(InstructorService);
  profile = signal<InstructorProfile | null>(null);
  error = signal<string | null>(null);

  constructor() {
    this.service.getProfile().subscribe({ next: p => this.profile.set(p), error: e => this.error.set(problemMessage(e)) });
  }
}
