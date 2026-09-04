import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { InstructorDashboardComponent } from './features/instructur-dashboard/instructur-dashboard.componenet';

export const routes: Routes = [

     {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
      { 
        path: "command-center", 
        component: InstructorDashboardComponent, 
        canActivate:[roleGuard('Admin')]
     },

    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component')
        .then(m => m.LoginComponent)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./features/unauthorized/unauthorized.component')
        .then(m => m.UnauthorizedComponent)
    },



    {
        path: "dashboard",
        loadComponent: () =>
            import("./features/student-dashboard/student-dashboard.component")
        .then(
            (m) => m.StudentDashboardComponent,
        ),
        canActivate: [roleGuard('Student')]
    },
    {
        path: 'enroll',
        loadComponent: () => import('./features/enrollment-form/enrollment-form.component')
        .then(m => m.EnrollmentFormComponent),
        canActivate: [roleGuard('Student')]
    },

    {
        path: 'courses/:id',
        loadComponent: () => import('./features/course-detail/course-detail.component')
        .then(m=> m.CourseDetailComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
         path: 'admin/courses',
        loadComponent: () =>
        import('./features/admin-course-list/admin-course-list.component')
        .then(m => m.AdminCourseListComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'instructor-dashboard',
        loadComponent: () => import('./features/instructur-dashboard/instructur-dashboard.componenet')
        .then(m => m.InstructorDashboardComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'enrollments',
        loadComponent: () =>
        import('./features/enrollment-list/enrollment-list.component')
            .then(m => m.EnrollmentListComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'grade-submission',
        loadComponent: () =>
            import('./features/grade-submission/grade-submission.component')
            .then(m=> m.GradeSubmissionComponent),
        canActivate: [roleGuard('Admin')]
    },
    
      { path: '**', redirectTo: 'login' },
];