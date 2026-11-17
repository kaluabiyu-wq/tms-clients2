import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AttendanceService } from './attendance.service';
import { apiV2Url } from './api-url';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AttendanceService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates a session with POST /sessions', () => {
    const body = { courseId: 3, topic: 'Intro', startAt: '2026-01-01T09:00:00Z', endAt: '2026-01-01T10:00:00Z' };
    service.createSession(body).subscribe();

    const req = http.expectOne(`${apiV2Url}/sessions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('lists the sessions of a course with paging params', () => {
    service.listSessions(7, 2, 10).subscribe();

    const req = http.expectOne((r) => r.url === `${apiV2Url}/courses/7/sessions`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');
    req.flush({ items: [], totalCount: 0, page: 2, pageSize: 10 });
  });

  it('saves the roster by wrapping the entries in { entries }', () => {
    const entries = [{ studentId: 1, status: 'Present' as const }];
    service.saveAttendance(5, entries).subscribe();

    const req = http.expectOne(`${apiV2Url}/sessions/5/attendance`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ entries });
    req.flush({});
  });

  it('updates one record with PUT /attendance/{id}', () => {
    service.updateRecord(9, { status: 'Excused', remarks: 'Doctor' }).subscribe();

    const req = http.expectOne(`${apiV2Url}/attendance/9`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('sends courseId for the student report only when given', () => {
    service.getStudentAttendance(4, 8).subscribe();
    const withCourse = http.expectOne((r) => r.url === `${apiV2Url}/students/4/attendance`);
    expect(withCourse.request.params.get('courseId')).toBe('8');
    withCourse.flush({});

    service.getStudentAttendance(4).subscribe();
    const without = http.expectOne((r) => r.url === `${apiV2Url}/students/4/attendance`);
    expect(without.request.params.has('courseId')).toBe(false);
    without.flush({});
  });

  it('reads the course summary', () => {
    service.getCourseSummary(2).subscribe();
    http.expectOne(`${apiV2Url}/courses/2/attendance/summary`).flush({});
  });
});
