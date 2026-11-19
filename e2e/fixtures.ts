import { test as base, expect, type BrowserContext, type Route } from '@playwright/test';

/**
 * Every browser context in the e2e suite gets a fake TMS API, so the tests never need the
 * real .NET backend (which does not exist on a GitHub runner). The dev server calls the API at
 * environment.development.ts -> http://localhost:5285, so that is the origin intercepted here.
 */
const API_ORIGIN = 'http://localhost:5285';

/** Builds a JWT shaped like the one AuthService decodes. The signature is never checked client-side. */
function fakeJwt(role: string): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const payload = {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'admin@example.com',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': role,
    FirstName: 'Admin',
    LastName: 'User',
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.signature`;
}

type Status = 'Pending' | 'Approved' | 'Rejected';

interface MockEnrollment {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  status: Status;
  enrolledAt: string;
}

function seedEnrollments(): MockEnrollment[] {
  const enrolledAt = '2026-11-01T09:00:00Z';
  return [
    { id: 1, studentId: 101, studentName: 'Abel Tesfaye', courseId: 1, courseName: 'Introduction to C#', status: 'Pending', enrolledAt },
    { id: 2, studentId: 102, studentName: 'Sara Kebede', courseId: 2, courseName: 'TypeScript Fundamentals', status: 'Pending', enrolledAt },
    { id: 3, studentId: 103, studentName: 'Daniel Bekele', courseId: 1, courseName: 'Introduction to C#', status: 'Rejected', enrolledAt },
  ];
}

const COURSES = [
  { id: 1, code: 'CS101', title: 'Introduction to C#', maxCapacity: 30, enrollmentCount: 12 },
  { id: 2, code: 'CS102', title: 'TypeScript Fundamentals', maxCapacity: 25, enrollmentCount: 9 },
];

async function installApiMocks(context: BrowserContext): Promise<void> {
  // State lives inside this call, so every test (and the login setup) starts from the same seed data.
  const enrollments = seedEnrollments();

  const respond = (route: Route, status: number, body?: unknown) => {
    const request = route.request();
    // The app runs on :4200 and the API on :5285, so the browser enforces CORS on these replies.
    const headers: Record<string, string> = {
      'access-control-allow-origin': request.headers()['origin'] ?? '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      // "*" does not cover Authorization, so echo whatever the preflight asked for.
      'access-control-allow-headers':
        request.headers()['access-control-request-headers'] ?? 'authorization, content-type',
    };
    if (body === undefined) return route.fulfill({ status, headers });
    return route.fulfill({
      status,
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  await context.route(new RegExp(`^${API_ORIGIN}/(api|hubs)/`), async (route) => {
    const request = route.request();
    const method = request.method();
    const path = new URL(request.url()).pathname;

    if (method === 'OPTIONS') return respond(route, 204);

    // SignalR: refusing the negotiate call makes the app log "connection unavailable" and carry on.
    if (path.startsWith('/hubs/')) return respond(route, 404);

    if (method === 'POST' && (path === '/api/v1/auth/login' || path === '/api/v1/auth/refresh')) {
      return respond(route, 200, { accessToken: fakeJwt('Admin'), refreshToken: 'mock-refresh-token' });
    }

    if (method === 'GET' && path === '/api/v1/enrollments') {
      return respond(route, 200, enrollments);
    }

    const approve = path.match(/^\/api\/v1\/enrollments\/([^/]+)\/approve$/);
    if (method === 'POST' && approve) {
      const row = enrollments.find((e) => e.id === Number(approve[1]));
      if (!row) return respond(route, 404, { title: 'Not Found', status: 404 });
      row.status = 'Approved';
      // The backend approval endpoint confirms the state transition with 204 No Content.
      return respond(route, 204);
    }

    if (method === 'GET' && path === '/api/v1/courses') {
      return respond(route, 200, {
        items: COURSES,
        totalCount: COURSES.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      });
    }

    if (method === 'GET' && path === '/api/v2/notifications/unread-count') {
      return respond(route, 200, { unreadCount: 0 });
    }
    if (method === 'GET' && path === '/api/v2/notifications') {
      return respond(route, 200, { items: [], page: 1, pageSize: 8, totalCount: 0, unreadCount: 0 });
    }

    // Anything else is a call this suite did not plan for: fail loudly so it shows up in the log.
    console.warn(`[e2e] unmocked API call: ${method} ${path}`);
    return respond(route, 404, { title: 'Not mocked in e2e', status: 404 });
  });
}

export const test = base.extend<{ apiMocks: void }>({
  apiMocks: [
    async ({ context }, use) => {
      await installApiMocks(context);
      await use();
    },
    { auto: true },
  ],
});

export { expect };
