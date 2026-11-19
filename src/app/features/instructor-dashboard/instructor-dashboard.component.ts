import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorDashboard } from '../../models/instructor.model';
import { AuthService } from '../../services/auth.service';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-portal-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <section class="page">
      <h1>Welcome, {{ auth.currentUser()?.displayName }}</h1>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (loading()) { <p>Loading…</p> }
      @else if (data(); as d) {
        <div class="cards">
          <a class="card" routerLink="/instructor/courses"><strong>{{ d.courseCount }}</strong><span>My courses</span></a>
          <a class="card" routerLink="/instructor/students"><strong>{{ d.studentCount }}</strong><span>Approved students</span></a>
          <a class="card" routerLink="/instructor/students"><strong>{{ d.pendingEnrollments }}</strong><span>Pending enrollments</span></a>
          <a class="card" routerLink="/instructor/assessments"><strong>{{ d.draftAssessments }}</strong><span>Draft assessments</span></a>
          <a class="card" routerLink="/instructor/assessments"><strong>{{ d.publishedAssessments }}</strong><span>Live assessments</span></a>
          <a class="card" routerLink="/instructor/timetable"><strong>{{ d.upcomingClassCount }}</strong><span>Upcoming classes</span></a>
        </div>
        <h2>Next classes</h2>
        @if (!d.nextClasses.length) { <p>No upcoming classes.</p> }
        @for (c of d.nextClasses; track c.scheduleId) {
          <article class="event">
            <div class="time">{{ c.startAt | date:'EEE, MMM d' }} · {{ c.startAt | date:'shortTime' }}–{{ c.endAt | date:'shortTime' }}</div>
            <h3>{{ c.courseCode }} — {{ c.courseTitle }}</h3>
            <p>{{ c.classroomName }}@if (c.topic) { · {{ c.topic }} }</p>
          </article>
        }
      }
    </section>
  `,
  styles: [`
    .page{padding:1.5rem}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin:1rem 0 2rem}
    .card{display:flex;flex-direction:column;gap:.25rem;padding:1rem;border:1px solid #d9dee8;border-radius:10px;text-decoration:none;color:inherit}
    .card strong{font-size:1.8rem;color:#2457a7}.card span{color:#667085}
    .event{padding:1rem;margin:.75rem 0;border:1px solid #d9dee8;border-left:4px solid #2457a7;border-radius:9px}
    .event h3{margin:.4rem 0}.event p{margin:.25rem 0;color:#667085}.time{font-weight:600;color:#2457a7}.error{color:#a32121}
  `],
})
export class InstructorPortalDashboardComponent {
  private service = inject(InstructorService);
  auth = inject(AuthService);
  data = signal<InstructorDashboard | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.service.getDashboard().subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e)); this.loading.set(false); },
    });
  }
}
