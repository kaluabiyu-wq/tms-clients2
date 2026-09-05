import { Component, input, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { CourseService } from '../../services/course.service';
// Adjust this import to wherever EnrolledStudent actually lives in your project
// (the PDF placed it as an Angular interface alongside CourseDetail).
import { EnrolledStudent } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  imports: [RouterLink, MatTableModule, MatSortModule, MatPaginatorModule],
  standalone: true,
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  private courseService = inject(CourseService);
  id = input.required<string>();

  // Columns rendered in the enrollment table, in order — matColumnDef names
  // in the template must match these exactly.
  displayedColumns = ['registrationNumber', 'name'];

  // MatTableDataSource owns sorting/pagination/filtering logic internally;
  // we only ever replace .data and hand it the sort/paginator instances.
  dataSource = new MatTableDataSource<EnrolledStudent>([]);

  // Signal-based view queries: undefined until the paginator/sort directive
  // actually exists in the DOM (they're behind the @if in the template).
  sort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);

  course = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.courseService.getById(params.id),
  });

  constructor() {
    // Whenever a new course loads (including switching to a different id),
    // push its enrollments into the dataSource. MatTableDataSource re-renders
    // through sort/paginator automatically — no manual slicing needed.
    effect(() => {
      this.dataSource.data = this.course.value()?.enrollments ?? [];
    });

    // Reruns the moment the paginator/sort elements appear in the DOM
    // (i.e. once enrollments.length > 0 and the @else branch renders).
    effect(() => {
      const sort = this.sort();
      const paginator = this.paginator();
      if (sort) this.dataSource.sort = sort;
      if (paginator) this.dataSource.paginator = paginator;
    });
  }
}