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
        canActivate: [roleGuard('Admin')]
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
        .then(m => m.CourseDetailComponent),
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
            .then(m => m.GradeSubmissionComponent),
        canActivate: [roleGuard('Admin')]
    },

    {
        path: 'admin/classrooms',
        loadComponent: () => import('./features/classroom-management/classroom-management.component')
        .then(m => m.ClassroomManagementComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'attendance/sessions',
        loadComponent: () => import('./features/attendance/session-management/session-management.component')
        .then(m => m.SessionManagementComponent),
        canActivate: [roleGuard('Instructor')]
    },
    {
        path: 'attendance/session/:sessionId',
        loadComponent: () => import('./features/attendance/attendance-management/attendance-management.component')
        .then(m => m.AttendanceManagementComponent),
        canActivate: [roleGuard('Instructor')]
    },
    {
        path: 'attendance/student/:studentId',
        loadComponent: () => import('./features/attendance/student-attendance/student-attendance.component')
        .then(m => m.StudentAttendanceComponent),
        canActivate: [roleGuard('Instructor')]
    },

    {
        path: 'courses/:courseId/assessments',
        loadComponent: () => import('./features/assessment-management/assessment-management.component')
          .then(m => m.AssessmentManagementComponent),
        canActivate: [roleGuard('Instructor')]
    },
    {
        path: 'courses/:courseId/assessments/:assessmentId/questions',
        loadComponent: () => import('./features/question-management/question-management.component')
          .then(m => m.QuestionManagementComponent),
        canActivate: [roleGuard('Instructor')]
    },
    {
        path: 'courses/:courseId/assessments/:assessmentId/submissions',
        loadComponent: () => import('./features/assessment-submissions/assessment-submissions.component')
          .then(m => m.AssessmentSubmissionsComponent),
        canActivate: [roleGuard('Instructor')]
    },
    {
        path: 'assessments/:assessmentId/take',
        loadComponent: () => import('./features/examination/examination.component')
          .then(m => m.ExaminationComponent),
        canActivate: [roleGuard('Student')]
    },

    // ───────────── Phase 5: Gradebook ─────────────

    // Instructor gradebook (the API also checks the instructor is assigned to the course)
    {
        path: 'courses/:courseId/gradebook',
        loadComponent: () => import('./features/gradebook/gradebook.component')
          .then(m => m.GradebookComponent),
        canActivate: [roleGuard('Instructor')]
    },
    // Admin gradebook (same component, separate path because roleGuard takes one role)
    {
        path: 'admin/courses/:courseId/gradebook',
        loadComponent: () => import('./features/gradebook/gradebook.component')
          .then(m => m.GradebookComponent),
        canActivate: [roleGuard('Admin')]
    },

    // Student: own published grades (uses GET /gradebook/me, no student id in the URL)
    {
        path: 'my-grades',
        loadComponent: () => import('./features/student-grades/student-grades.component')
          .then(m => m.StudentGradesComponent),
        canActivate: [roleGuard('Student')]
    },
    // Student: submit and track appeals
    {
        path: 'my-appeals',
        data: { mode: 'student' },
        loadComponent: () => import('./features/grade-appeals/grade-appeals.component')
          .then(m => m.GradeAppealsComponent),
        canActivate: [roleGuard('Student')]
    },

    // Staff: appeal review queue
    {
        path: 'grade-appeals',
        data: { mode: 'staff' },
        loadComponent: () => import('./features/grade-appeals/grade-appeals.component')
          .then(m => m.GradeAppealsComponent),
        canActivate: [roleGuard('Instructor')]
    },
    {
        path: 'admin/grade-appeals',
        data: { mode: 'staff' },
        loadComponent: () => import('./features/grade-appeals/grade-appeals.component')
          .then(m => m.GradeAppealsComponent),
        canActivate: [roleGuard('Admin')]
    },

    { path: '**', redirectTo: 'login' },
];