import { Component,signal,computed, inject, OnInit } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { CourseService } from '../../services/course.service';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CourseCardComponent],
  standalone:true,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent implements OnInit{
     public courseStore = inject(CourseStore);
     private authService = inject(AuthService);
      Name = computed(() => this.authService.currentUser()?.displayName ?? "User");
      isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin'); 
     earnedCredits = signal(45);
     graduationStatus = computed(() =>
      this.earnedCredits() >= 120 ? "Eligable for Graduation " : "In Progress",);
     registerForClass()
     {
      this.earnedCredits.update((c)=> c + 3);
     }

  selectedCourse = signal<Course | null>(null);
     handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
  }

  handleDelete(course: Course) {
    this.courseStore.deleteCourse(course.id);
  }

  ngOnInit() {
    this.courseStore.loadCourses();
  }
}