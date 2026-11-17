import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SessionManagementComponent } from './session-management.component';
import { apiV2Url } from '../../../services/api-url';
import { environment } from '../../../../environments/environment';

const emptySummary = {
  courseId: 1, courseCode: 'WEB101', courseTitle: 'Web', sessionsHeld: 0,
  overall: { present: 0, late: 0, absent: 0, excused: 0, counted: 0, percentage: null }, students: [],
};

describe('SessionManagementComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionManagementComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  function create() {
    const fixture = TestBed.createComponent(SessionManagementComponent);
    http
      .expectOne((r) => r.url === `${environment.apiUrl}/courses`)
      .flush({ items: [{ id: 1, code: 'WEB101', title: 'Web', maxCapacity: 30, enrollmentCount: 2 }], totalCount: 1, page: 1, pageSize: 50 });
    return fixture;
  }

  it('loads sessions and the summary after a course is picked', async () => {
    const fixture = create();
    fixture.componentInstance.selectCourse('1');

    http.expectOne((r) => r.url === `${apiV2Url}/courses/1/sessions`).flush({
      items: [{ id: 5, courseId: 1, courseCode: 'WEB101', topic: 'Intro', startAt: '2026-01-01T09:00:00Z',
        endAt: '2026-01-01T10:00:00Z', instructorId: 'i', enrolledCount: 2, recordedCount: 1 }],
      totalCount: 1, page: 1, pageSize: 50,
    });
    http.expectOne(`${apiV2Url}/courses/1/attendance/summary`).flush(emptySummary);
    await fixture.whenStable();

    expect(fixture.componentInstance.sessions().length).toBe(1);
    expect(fixture.componentInstance.summary()?.sessionsHeld).toBe(0);
  });

  it('does not post an invalid form', () => {
    const fixture = create();
    fixture.componentInstance.selectCourse('1');
    http.expectOne((r) => r.url === `${apiV2Url}/courses/1/sessions`).flush({ items: [], totalCount: 0, page: 1, pageSize: 50 });
    http.expectOne(`${apiV2Url}/courses/1/attendance/summary`).flush(emptySummary);

    fixture.componentInstance.createSession();

    http.expectNone(`${apiV2Url}/sessions`);
    expect(fixture.componentInstance.form.touched).toBe(true);
  });

  it('rejects a session that ends before it starts', () => {
    const fixture = create();
    fixture.componentInstance.form.setValue({ topic: 'Backwards', startAt: '2026-01-01T10:00', endAt: '2026-01-01T09:00' });

    expect(fixture.componentInstance.form.hasError('endBeforeStart')).toBe(true);
  });
});
