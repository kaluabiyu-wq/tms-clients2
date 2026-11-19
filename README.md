# TMS Client

Angular 22 standalone client for the Training Management System. The client is designed to work with the ASP.NET Core API in the companion `TmsApi` project and uses the existing V1 endpoints where the backend retains them, plus V2 endpoints for newer workflows.

## Technology

- Angular 22.0.8, TypeScript 6, standalone components and lazy-loaded routes
- Angular Material and SCSS design tokens
- RxJS and NgRx Signals for asynchronous and shared state
- ASP.NET Core REST API with JWT bearer authentication
- SignalR for enrollment and notification updates
- Vitest for unit tests and Playwright for end-to-end tests

## Implemented client areas

| Area | Client functionality | API integration |
|---|---|---|
| Authentication | Login, token refresh, role-aware route guards, logout | V1 auth |
| Course catalogue | Browse, view and manage courses; student enrollment | V1 courses/enrollments |
| Enrollment administration | Enrollment list, approval workflow, live status updates | V1 enrollment compatibility endpoints and V2 enrollment workflow |
| Classrooms and attendance | Classroom management, training sessions, session rosters, attendance records and summaries | V2 classrooms and attendance |
| Assessments | Assessment setup, question management, submissions, examination attempts and grading | V2 assessment workflow |
| Gradebook | Publish grades from graded submissions, calculate final grades, student grade view and grade appeals | V2 gradebook |
| Certificates | Templates, issue/list/download/revoke, student certificates and public verification | V2 certificates |
| Audit | Filter and export audit history | V2 audit |
| Notifications | In-app inbox, unread count, preferences and SignalR updates | V2 notifications + SignalR |
| Institutional reporting | Dashboard KPIs, paged reports, PDF/XLSX generation and downloads | V2 reports |
| Training programs | Program setup, curriculum, student registration and progress tracking | V2 programs/progress |

## Design system

The application uses a professional blue-and-amber palette with a light slate workspace. Shared variables live in `src/styles.scss`; feature styles should use these tokens rather than introducing unrelated colors. See [`COLOR_PALETTE.md`](./COLOR_PALETTE.md).

- Blue is the primary navigation and standard action color.
- Green is reserved for successful actions and completed states.
- Red is reserved for destructive actions and errors.
- Amber is an accent for progress and emphasis; use dark text on amber surfaces.
- Status is always communicated with text or an icon as well as color.

## Requirements

- Node.js `^22.22.3`, `^24.15.0`, or `>=26` (required by Angular CLI 22)
- npm compatible with the package lock
- The companion TMS API running for live integration testing
- Playwright Chromium browser for E2E tests

## Local development

From this directory:

```bash
npm ci
npm start
```

The Angular development server is available at `http://localhost:4200`.

### API configuration

Update the environment files when changing API hosts:

- `src/environments/environment.development.ts` — local API URL and SignalR hub
- `src/environments/environment.ts` — production API URL and SignalR hub

`apiV2Url` derives the V2 root from `environment.apiUrl`, so V1 and V2 services share the same API host. Do not hardcode a second API host in feature services.

## Build and unit tests

```bash
npm run build
npm test
```

## End-to-end tests

The Playwright suite uses a mocked API, so the E2E workflow does not require a running .NET backend. The Playwright config starts the Angular development server automatically.

```bash
npx playwright install chromium
npm run e2e
```

Useful alternatives:

```bash
npm run e2e:headed
npm run e2e:ui
```

The current E2E coverage includes admin login/session setup, approval of a pending enrollment and enrollment totals in the command center. API mocks are defined in `e2e/fixtures.ts`. Authentication state and generated Playwright reports are ignored by Git.

## Key routes

| Route | Access |
|---|---|
| `/login` | Public |
| `/dashboard`, `/enroll`, `/my-progress`, `/my-grades`, `/my-certificates` | Student (Admin can access dashboard through the compatibility guard) |
| `/enrollments` | Admin / Instructor can approve; Registrar has read access |
| `/instructor-dashboard`, `/command-center` | Admin / Instructor |
| `/student/courses/:courseId/assessments` | Student |
| `/courses/:courseId/assessments` | Instructor / Admin |
| `/courses/:courseId/gradebook` | Admin / Instructor |
| `/attendance/sessions` | Admin / Instructor |
| `/admin/courses`, `/admin/classrooms` | Admin |
| `/admin/programs` | Admin / SuperAdmin |
| `/admin/programs/:id/enroll` | Admin / SuperAdmin / Registrar |
| `/admin/certificates`, `/admin/certificate-templates` | Admin / Registrar / SuperAdmin |
| `/admin/audit-logs` | Admin / SuperAdmin / Auditor |
| `/admin/reports` | Admin / SuperAdmin / Registrar / Auditor |
| `/notifications` | Authenticated application roles |
| `/certificate-verification/:code` | Public |

## Integration notes

- The API is authoritative for authorization, enrollment capacity, grade publication, final-grade calculation, certificate eligibility and student ownership. Client-side guards are for navigation only and do not replace server authorization.
- Gradebook publication uses the server's already-graded assessment submissions; the browser does not submit or calculate authoritative marks.
- Final-grade calculation requires all published assessment weights to total exactly 100. Missing grades remain incomplete rather than being treated as zero.
- Student program progress is derived from existing course enrollment states. The client displays the API's completion percentage and does not edit it.
- Notification delivery and read state are persisted by the API. SignalR events update the client view but are not the source of truth.
- Certificate verification is public; certificate downloads and administrative actions remain authenticated.

## Troubleshooting

- If Angular reports an unsupported Node.js version, install a supported Node 22 patch release (`22.22.3` or later within the 22 line) or Node 24.15+.
- If the API is unreachable, verify the environment API URL, API CORS configuration, and that the backend is listening on the configured port.
- If E2E tests fail before opening a page, install the Chromium browser with `npx playwright install chromium`.
- If a role can see a navigation item but receives HTTP 403, verify both the client route guard and the backend policy/role claims. The backend remains authoritative.
