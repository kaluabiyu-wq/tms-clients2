import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentAttendance } from '../../../models/attendance.model';
import { AttendanceService } from '../../../services/attendance.service';
import { problemMessage } from '../../../util/problem-message';

@Component({
  selector: 'app-student-attendance',
  imports: [DatePipe, RouterLink],
  templateUrl: './student-attendance.component.html',
  styleUrl: './student-attendance.component.scss',
})
export class StudentAttendanceComponent implements OnInit {
  private attendance = inject(AttendanceService);

  /** Route parameter `:studentId` and optional query parameter `?courseId=`, both bound as inputs. */
  studentId = input.required<string>();
  courseId = input<string>();

  report = signal<StudentAttendance | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.load(1);
  }

  load(page: number) {
    this.isLoading.set(true);
    this.error.set(null);

    const course = this.courseId();
    this.attendance.getStudentAttendance(Number(this.studentId()), course ? Number(course) : null, page).subscribe({
      next: (report) => {
        this.report.set(report);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(problemMessage(err, 'Failed to load the attendance report.'));
        this.isLoading.set(false);
      },
    });
  }
}
