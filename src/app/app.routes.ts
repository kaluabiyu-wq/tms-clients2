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
        canActivate: [roleGuard(['Instructor', 'Admin'])]
    },
    {
        path: 'attendance/session/:sessionId',
        loadComponent: () => import('./features/attendance/attendance-management/attendance-management.component')
        .then(m => m.AttendanceManagementComponent),
        canActivate: [roleGuard(['Instructor', 'Admin'])]
    },
    {
        path: 'attendance/student/:studentId',
        loadComponent: () => import('./features/attendance/student-attendance/student-attendance.component')
        .then(m => m.StudentAttendanceComponent),
        canActivate: [roleGuard(['Instructor', 'Admin'])]
    },
  
    {
        path: 'courses/:courseId/assessments',
        loadComponent: () => import('./features/assessment-management/assessment-management.component')
          .then(m => m.AssessmentManagementComponent),
        canActivate: [roleGuard(['Instructor', 'Admin'])]
    },
    {
        path: 'courses/:courseId/assessments/:assessmentId/questions',
        loadComponent: () => import('./features/question-management/question-management.component')
          .then(m => m.QuestionManagementComponent),
        canActivate: [roleGuard(['Instructor', 'Admin'])]
    },
    {
        path: 'courses/:courseId/assessments/:assessmentId/submissions',
        loadComponent: () => import('./features/assessment-submissions/assessment-submissions.component')
          .then(m => m.AssessmentSubmissionsComponent),
        canActivate: [roleGuard(['Instructor', 'Admin'])]
    },
    {
        path: 'assessments/:assessmentId/take',
        loadComponent: () => import('./features/examination/examination.component')
          .then(m => m.ExaminationComponent),
        canActivate: [roleGuard('Student')]
    },
    {
        path: 'admin/certificates',
        loadComponent: () => import('./features/certificate-management/certificate-management.component')
          .then(m => m.CertificateManagementComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'admin/certificate-templates',
        loadComponent: () => import('./features/certificate-templates/certificate-templates.component')
          .then(m => m.CertificateTemplatesComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'my-certificates',
        loadComponent: () => import('./features/student-certificates/student-certificates.component')
          .then(m => m.StudentCertificatesComponent),
        canActivate: [roleGuard('Student')]
    },
    {
        path: 'certificate-verification/:code',
        loadComponent: () => import('./features/certificate-verification/certificate-verification.component')
          .then(m => m.CertificateVerificationComponent)
    },
    {
        path: 'certificate-verification',
        loadComponent: () => import('./features/certificate-verification/certificate-verification.component')
          .then(m => m.CertificateVerificationComponent)
    },
    {
        path: 'admin/audit-logs',
        loadComponent: () => import('./features/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin', 'Auditor'])]
    },
    {
        path: 'notifications',
        loadComponent: () => import('./features/notification-center/notification-center.component').then(m => m.NotificationCenterComponent),
        canActivate: [roleGuard(['Admin', 'Student', 'Instructor', 'Registrar', 'SuperAdmin', 'Auditor'])]
    },
    {
        path: 'notifications/preferences',
        loadComponent: () => import('./features/notification-preferences/notification-preferences.component').then(m => m.NotificationPreferencesComponent),
        canActivate: [roleGuard(['Admin', 'Student', 'Instructor', 'Registrar', 'SuperAdmin', 'Auditor'])]
    },
    {
        path: 'admin/reports',
        loadComponent: () => import('./features/institutional-reports/institutional-reports.component').then(m => m.InstitutionalReportsComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin', 'Registrar', 'Auditor'])]
    },
    {
        path: 'admin/programs',
        loadComponent: () => import('./features/program-management/program-management.component').then(m => m.ProgramManagementComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin'])]
    },
    {
        path: 'admin/programs/:id/courses',
        loadComponent: () => import('./features/program-course-management/program-course-management.component').then(m => m.ProgramCourseManagementComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin'])]
    },
    {
        path: 'admin/programs/:id/enroll',
        loadComponent: () => import('./features/student-program-enrollment/student-program-enrollment.component').then(m => m.StudentProgramEnrollmentComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin', 'Registrar'])]
    },
    {
        path: 'admin/programs/:id/progress',
        loadComponent: () => import('./features/student-progress/student-progress.component').then(m => m.StudentProgressComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin', 'Registrar', 'Auditor'])]
    },
    {
        path: 'admin/students/:studentId/progress',
        loadComponent: () => import('./features/student-progress/student-progress.component').then(m => m.StudentProgressComponent),
        canActivate: [roleGuard(['Admin', 'SuperAdmin', 'Registrar', 'Auditor'])]
    },
    {
        path: 'my-progress',
        loadComponent: () => import('./features/student-progress/student-progress.component').then(m => m.StudentProgressComponent),
        canActivate: [roleGuard('Student')]
    },
    {
        path: 'admin/schedules',
        loadComponent: () => import('./features/schedule-management/schedule-management.component')
          .then(m => m.ScheduleManagementComponent),
        canActivate: [roleGuard('Admin')]
    },
    {
        path: 'instructor/timetable',
        loadComponent: () => import('./features/instructor-timetable/instructor-timetable.component')
          .then(m => m.InstructorTimetableComponent),
        canActivate: [roleGuard('Instructor')]
    },

    // ---- Role portals: separate sign-in pages, same Identity + JWT backend ----
    { path: 'student/login', data: { expectedRole: 'Student' },
      loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
    { path: 'instructor/login', data: { expectedRole: 'Instructor' },
      loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
    { path: 'admin/login', data: { expectedRole: 'Admin' },
      loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },

    { path: 'student/dashboard', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'admin/dashboard',
      loadComponent: () => import('./features/instructur-dashboard/instructur-dashboard.componenet').then(m => m.InstructorDashboardComponent),
      canActivate: [roleGuard('Admin')] },

    { path: 'instructor', redirectTo: 'instructor/dashboard', pathMatch: 'full' },
    { path: 'instructor/dashboard',
      loadComponent: () => import('./features/instructor-dashboard/instructor-dashboard.component').then(m => m.InstructorPortalDashboardComponent),
      canActivate: [roleGuard('Instructor')] },
    { path: 'instructor/courses',
      loadComponent: () => import('./features/instructor-courses/instructor-courses.component').then(m => m.InstructorCoursesComponent),
      canActivate: [roleGuard('Instructor')] },
    { path: 'instructor/students',
      loadComponent: () => import('./features/instructor-students/instructor-students.component').then(m => m.InstructorStudentsComponent),
      canActivate: [roleGuard('Instructor')] },
    { path: 'instructor/attendance', redirectTo: 'attendance/sessions', pathMatch: 'full' },
    { path: 'instructor/assessments',
      loadComponent: () => import('./features/instructor-assessments/instructor-assessments.component').then(m => m.InstructorAssessmentsComponent),
      canActivate: [roleGuard('Instructor')] },
    { path: 'instructor/gradebook',
      loadComponent: () => import('./features/instructor-gradebook/instructor-gradebook.component').then(m => m.InstructorGradebookComponent),
      canActivate: [roleGuard('Instructor')] },
    { path: 'instructor/notifications', redirectTo: 'notifications', pathMatch: 'full' },
    { path: 'instructor/profile',
      loadComponent: () => import('./features/instructor-profile/instructor-profile.component').then(m => m.InstructorProfileComponent),
      canActivate: [roleGuard('Instructor')] },
    { path: '**', redirectTo: 'login' },
];