import { Component, inject, signal } from '@angular/core';
import { InstructorService } from '../../services/instructor.service';
import { InstructorProfile } from '../../models/instructor.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  template: `
    <section class="page">
      <h1>My profile</h1>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (profile(); as p) {
        <dl>
          <dt>Name</dt><dd>{{ p.firstName }} {{ p.lastName }}</dd>
          <dt>Email</dt><dd>{{ p.email }}</dd>
          <dt>Department</dt><dd>{{ p.department || '—' }}</dd>
          <dt>Role</dt><dd>Instructor</dd>
        </dl>
      } @else if (!error()) { <p>Loading…</p> }
    </section>
  `,
  styles: [`.page{padding:1.5rem}dl{display:grid;grid-template-columns:140px 1fr;gap:.6rem}dt{font-weight:600;color:#667085}dd{margin:0}.error{color:#a32121}`],
})
export class InstructorProfileComponent {
  private service = inject(InstructorService);
  profile = signal<InstructorProfile | null>(null);
  error = signal<string | null>(null);

  constructor() {
    this.service.getProfile().subscribe({ next: p => this.profile.set(p), error: e => this.error.set(problemMessage(e)) });
  }
}
