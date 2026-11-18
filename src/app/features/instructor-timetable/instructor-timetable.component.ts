import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { CourseSchedule } from '../../models/course-schedule.model';
import { AuthService } from '../../services/auth.service';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-instructor-timetable',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="page">
      <h1>My teaching timetable</h1>
      <div class="toolbar">
        <button type="button" (click)="move(-7)">Previous week</button>
        <strong>{{ weekLabel() }}</strong>
        <button type="button" (click)="move(7)">Next week</button>
        <button type="button" (click)="load()">Today</button>
      </div>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (loading()) { <p>Loading timetable…</p> }
      @else if (!items().length) { <p>No classes scheduled for this week.</p> }
      @else {
        @for (item of items(); track item.id) {
          <article class="event">
            <div class="time">{{ item.startAt | date:'EEE, MMM d' }} · {{ item.startAt | date:'shortTime' }}–{{ item.endAt | date:'shortTime' }}</div>
            <h3>{{ item.courseCode }} — {{ item.courseTitle }}</h3>
            <p>{{ item.classroomName }} · {{ item.classroomLocation }}</p>
            @if (item.topic) { <p>{{ item.topic }}</p> }
          </article>
        }
      }
    </section>
  `,
  styles: [`
    .page{padding:1.5rem}.toolbar{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin:1rem 0 1.5rem}
    button{padding:.6rem .85rem;border:0;border-radius:7px;background:#2457a7;color:white;cursor:pointer}
    .event{padding:1rem;margin:.75rem 0;border:1px solid #d9dee8;border-left:4px solid #2457a7;border-radius:9px}
    .event h3{margin:.4rem 0}.event p{margin:.25rem 0;color:#667085}.time{font-weight:600;color:#2457a7}
    .error{color:#a32121}
  `],
})
export class InstructorTimetableComponent {
  private service = inject(ScheduleService);
  private auth = inject(AuthService);
  items = signal<CourseSchedule[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  private weekStart = this.monday(new Date());

  weekLabel() {
    const end = new Date(this.weekStart);
    end.setDate(end.getDate() + 6);
    return `${this.weekStart.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  }

  constructor() { this.load(); }

  move(days: number) {
    this.weekStart.setDate(this.weekStart.getDate() + days);
    this.load();
  }

  load() {
    // The API enforces that an Instructor can only request their own user ID.
    const userId = this.auth.currentUser()?.id;
    if (!userId) { this.error.set('Unable to determine the signed-in instructor.'); return; }
    const end = new Date(this.weekStart);
    end.setDate(end.getDate() + 7);
    this.loading.set(true);
    this.error.set(null);
    this.service.getInstructorSchedule(userId, this.weekStart.toISOString(), end.toISOString()).subscribe({
      next: rows => { this.items.set(rows); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e, 'Unable to load your timetable.')); this.loading.set(false); },
    });
  }

  private monday(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
