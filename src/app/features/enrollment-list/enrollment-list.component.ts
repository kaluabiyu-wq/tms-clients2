import { Component, viewChild, effect, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.scss',
})
export class EnrollmentListComponent {
  readonly store = inject(EnrollmentStore);
  readonly displayedColumns = ['student', 'course', 'submitted', 'status', 'actions'];
  readonly dataSource = new MatTableDataSource<Enrollment>();

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {
    this.dataSource.filterPredicate = (row, filter) => {
      const criteria = JSON.parse(filter) as { query: string; status: string };
      const query = criteria.query;
      const matchesQuery = !query || [
        row.studentName, row.studentId, row.courseName, row.courseCode,
      ].some(value => (value ?? '').toLowerCase().includes(query));
      const matchesStatus = !criteria.status || row.status.toLowerCase() === criteria.status;
      return matchesQuery && matchesStatus;
    };

    effect(() => {
      this.dataSource.data = this.store.entities();
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });

    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }

  get approvedCount(): number {
    return this.store.entities().filter(e => e.status === 'Approved').length;
  }

  get rejectedCount(): number {
    return this.store.entities().filter(e => e.status === 'Rejected').length;
  }

  applyFilters(query: string, status: string): void {
    this.dataSource.filter = JSON.stringify({
      query: query.trim().toLowerCase(),
      status: status.toLowerCase(),
    });
    this.dataSource.paginator?.firstPage();
  }

  trackEnrollment(_index: number, row: Enrollment): number {
    return row.id;
  }
}
