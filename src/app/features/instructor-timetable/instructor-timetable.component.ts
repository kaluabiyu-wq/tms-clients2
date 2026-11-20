import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { CourseSchedule } from '../../models/course-schedule.model';
import { AuthService } from '../../services/auth.service';
import { problemMessage } from '../../util/problem-message';

interface TimetableDay {
  key: string;
  date: Date;
  label: string;
  isToday: boolean;
  classes: CourseSchedule[];
}

@Component({
  selector: 'app-instructor-timetable',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './instructor-timetable.component.html',
  styleUrl: './instructor-timetable.component.scss',
})
export class InstructorTimetableComponent {
  private service = inject(ScheduleService);
  private auth = inject(AuthService);
  items = signal<CourseSchedule[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  private weekStart = this.monday(new Date());
  private loadVersion = 0;
  days = computed<TimetableDay[]>(() => {
    const today = this.dateKey(new Date());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + index);
      const key = this.dateKey(date);
      return {
        key,
        date,
        label: date.toLocaleDateString(undefined, { weekday: 'short' }),
        isToday: key === today,
        classes: this.items().filter(item => this.dateKey(new Date(item.startAt)) === key)
          .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
      };
    });
  });

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

  goToToday() {
    this.weekStart = this.monday(new Date());
    this.load();
  }

  load() {
    const version = ++this.loadVersion;
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.items.set([]);
      this.error.set('Unable to determine the signed-in instructor. Please sign in again.');
      return;
    }
    const end = new Date(this.weekStart);
    end.setDate(end.getDate() + 7);
    this.loading.set(true);
    this.error.set(null);
    this.service.getInstructorSchedule(userId, this.weekStart.toISOString(), end.toISOString()).subscribe({
      next: rows => { if (version !== this.loadVersion) return; this.items.set(rows); this.loading.set(false); },
      error: e => { if (version !== this.loadVersion) return; this.error.set(problemMessage(e, 'Unable to load your timetable.')); this.loading.set(false); },
    });
  }

  private dateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private monday(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
