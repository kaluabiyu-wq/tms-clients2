import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';
import { CourseSchedule } from '../../models/course-schedule.model';
import { problemMessage } from '../../util/problem-message';

@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.scss',
})
export class ScheduleManagementComponent {
  private service = inject(ScheduleService);
  private fb = inject(FormBuilder);
  schedules = signal<CourseSchedule[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    courseId: [0, [Validators.required, Validators.min(1)]],
    instructorId: ['', [Validators.required, Validators.maxLength(450)]],
    classroomId: [0, [Validators.required, Validators.min(1)]],
    startAt: ['', Validators.required],
    endAt: ['', Validators.required],
    topic: [''],
  });

  constructor() { this.load(); }

  private range() {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const next = new Date(monday);
    next.setDate(monday.getDate() + 7);
    return { from: monday.toISOString(), to: next.toISOString() };
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    const r = this.range();
    this.service.getCalendar(r.from, r.to).subscribe({
      next: rows => { this.schedules.set(rows); this.loading.set(false); },
      error: e => { this.error.set(problemMessage(e, 'Unable to load the timetable.')); this.loading.set(false); },
    });
  }

  create() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const start = new Date(v.startAt);
    const end = new Date(v.endAt);
    if (end <= start) { this.error.set('End time must be later than start time.'); return; }

    this.saving.set(true);
    this.error.set(null);
    this.service.create({
      courseId: v.courseId,
      instructorId: v.instructorId.trim(),
      classroomId: v.classroomId,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      topic: v.topic.trim() || null,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset({ courseId: 0, instructorId: '', classroomId: 0, startAt: '', endAt: '', topic: '' });
        this.load();
      },
      error: e => { this.saving.set(false); this.error.set(problemMessage(e, 'Unable to create schedule.')); },
    });
  }

  cancel(item: CourseSchedule) {
    const confirmed = globalThis.confirm(`Cancel ${item.courseTitle} on ${new Date(item.startAt).toLocaleString()}?`);
    if (!confirmed) return;
    this.service.update(item.id, {
      courseId: item.courseId, instructorId: item.instructorId, classroomId: item.classroomId,
      startAt: item.startAt, endAt: item.endAt, topic: item.topic, isCancelled: true,
    }).subscribe({
      next: () => this.load(),
      error: e => this.error.set(problemMessage(e, 'Unable to cancel schedule.')),
    });
  }
}
