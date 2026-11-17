import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ATTENDANCE_STATUSES,
  AttendanceEntryRequest,
  AttendanceStatus,
  SessionAttendance,
  TrainingSession,
} from '../../../models/attendance.model';
import { AttendanceService } from '../../../services/attendance.service';
import { problemMessage } from '../../../util/problem-message';

type RosterGroup = FormGroup<{
  studentId: FormControl<number>;
  registrationNumber: FormControl<string>;
  studentName: FormControl<string>;
  coursePercentage: FormControl<number | null>;
  /** '' means "not marked yet". Unmarked is deliberately NOT the same as Absent. */
  status: FormControl<AttendanceStatus | ''>;
  remarks: FormControl<string>;
}>;

@Component({
  selector: 'app-attendance-management',
  imports: [ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './attendance-management.component.html',
  styleUrl: './attendance-management.component.scss',
})
export class AttendanceManagementComponent implements OnInit {
  private attendance = inject(AttendanceService);
  private fb = inject(FormBuilder);

  /** Bound from the route parameter `:sessionId` (withComponentInputBinding is enabled in app.config). */
  sessionId = input.required<string>();

  readonly statuses = ATTENDANCE_STATUSES;

  session = signal<TrainingSession | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  savedMessage = signal<string | null>(null);

  // A FormArray holds one FormGroup per student: this is the "FormArray or equivalent" from the roadmap.
  rows: FormArray<RosterGroup> = this.fb.array<RosterGroup>([]);
  form = this.fb.group({ rows: this.rows });

  // Signals do not see FormArray changes, so the count of marked rows is refreshed by hand.
  markedCount = signal(0);
  canSave = computed(() => this.markedCount() > 0 && !this.isSaving());

  ngOnInit() {
    this.load();
  }

  private load() {
    this.isLoading.set(true);
    this.error.set(null);

    this.attendance.getSessionAttendance(Number(this.sessionId())).subscribe({
      next: (roster) => {
        this.applyRoster(roster);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(problemMessage(err, 'Failed to load the attendance sheet.'));
        this.isLoading.set(false);
      },
    });
  }

  private applyRoster(roster: SessionAttendance) {
    this.session.set(roster.session);
    this.rows.clear();

    for (const row of roster.rows) {
      const group: RosterGroup = this.fb.nonNullable.group({
        studentId: row.studentId,
        registrationNumber: row.registrationNumber,
        studentName: row.studentName,
        coursePercentage: new FormControl<number | null>(row.coursePercentage, { nonNullable: false }),
        status: new FormControl<AttendanceStatus | ''>(row.status ?? '', { nonNullable: true }),
        remarks: [row.remarks ?? '', Validators.maxLength(500)],
      });
      this.rows.push(group);
    }
    this.refreshMarkedCount();
  }

  refreshMarkedCount() {
    this.markedCount.set(this.rows.controls.filter((g) => g.controls.status.value !== '').length);
  }

  setAll(status: AttendanceStatus) {
    for (const group of this.rows.controls) {
      group.controls.status.setValue(status);
    }
    this.refreshMarkedCount();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Only rows the instructor actually marked are sent; unmarked students stay unmarked.
    const entries: AttendanceEntryRequest[] = this.rows.controls
      .map((g) => g.getRawValue())
      .filter((r) => r.status !== '')
      .map((r) => ({
        studentId: r.studentId,
        status: r.status as AttendanceStatus,
        remarks: r.remarks.trim() === '' ? null : r.remarks.trim(),
      }));

    if (entries.length === 0) return;

    this.isSaving.set(true);
    this.error.set(null);
    this.savedMessage.set(null);

    this.attendance.saveAttendance(Number(this.sessionId()), entries).subscribe({
      next: (roster) => {
        // Rebuild from the server's answer so the screen shows what is really stored.
        this.applyRoster(roster);
        this.isSaving.set(false);
        this.savedMessage.set(`Saved ${entries.length} mark(s).`);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.error.set(problemMessage(err, 'Failed to save attendance.'));
      },
    });
  }
}
