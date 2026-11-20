import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CourseCardComponent, RouterLink],
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent implements OnInit {
  readonly courseStore = inject(CourseStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly Name = computed(() => this.authService.currentUser()?.displayName ?? 'Student');
  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin');
  readonly searchTerm = signal('');
  readonly availableCourses = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const courses = this.courseStore.entities() ?? [];
    if (!term) return courses;
    return courses.filter(course =>
      `${course.title} ${course.code}`.toLowerCase().includes(term),
    );
  });
  readonly courseCount = computed(() => (this.courseStore.entities() ?? []).length);
  readonly openCourseCount = computed(() =>
    (this.courseStore.entities() ?? []).filter(course => course.maxCapacity > course.enrollmentCount).length,
  );

  handleEnroll(course: Course): void {
    this.router.navigate(['/enroll'], { queryParams: { courseId: course.id } });
  }

  handleDelete(course: Course): void {
    this.courseStore.deleteCourse(course.id);
  }

  ngOnInit(): void {
    this.courseStore.loadCourses();
  }
}
