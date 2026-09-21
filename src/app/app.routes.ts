import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: "dashboard",
        loadComponent: () =>
            import("./features/student-dashboard/student-dashboard.component")
        .then(
            (m) => m.StudentDashboardComponent,
        ),
    },
    {
        path: "",redirectTo: "dashboard", pathMatch: "full"
    },
    {
        path: 'courses/:id',
        loadComponent: () => import('./features/course-detail/course-detail.component')
        .then(m=> m.CourseDetailComponent)
    },
    {
        path: 'enroll',
        loadComponent: () => import('./features/enrollment-form/enrollment-form.component')
        .then(m => m.EnrollmentFormComponent)
    },
    {
  path: 'instructor-dashboard',
  loadComponent: () => import('./features/instructur-dashboard/instructur-dashboard.componenet')
    .then(m => m.InstructorDashboardComponent),
},
{
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list.component')
        .then(m => m.EnrollmentListComponent)
  },
 
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
   {
     path: 'grade-submission',
 loadComponent: () =>
    import('./features/grade-submission/grade-submission.component')
     .then(m=> m.GradeSubmissionComponent)


  },
];
