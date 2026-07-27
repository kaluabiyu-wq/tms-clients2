import { Component,signal,computed, inject } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { CourseService } from '../../sercices/course.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CourseCardComponent],
  standalone:true,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
     private api = inject(CourseService);
     studentName = signal("Liya Kebede");
     earnedCredits = signal(45);
     graduationStatus = computed(() =>
      this.earnedCredits() >= 120 ? "Eligable for Graduation " : "In Progress",);
     registerForClass()
     {
      this.earnedCredits.update((c)=> c + 3);
     }
      selectedCourse = signal<Course | null>(null);
      sampleCourse: Course = {
        id: 1,
        title:"Advanced Java Services",
        code: "CSE-101",
        maxCapacity: 30,
        enrollmentCount: 12,
      };
      handleEnroll(course: Course)
      {
        this.selectedCourse.set(course);
        console.log('Enrollment requested for:', course.title);
      }
    
      availableCourses = signal<Course[]>([
    {
      id:1,
      title: "Advanced Java Services",
      code:"CSE-101",
      maxCapacity:30,
      enrollmentCount:10,

    },
    {
       id:2,
      title: "Angular UI Lab",
      code:"CSE-210",
      maxCapacity:25,
      enrollmentCount:25,

    },
    {
       id:3,
      title: "Database Design",
      code:"CSE-305",
      maxCapacity:20,
      enrollmentCount:18,

    },
    {
       id:4,
      title: "Api Security workshop",
      code:"CSE-420",
      maxCapacity:40,
      enrollmentCount:15,

    },

]);
  coursesResource = rxResource( {
    stream: () => this.api.getAll(),
  })



}
