import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AttendanceManagementComponent } from './attendance-management.component';
import { apiV2Url } from '../../../services/api-url';

const session = {
  id: 5, courseId: 1, courseCode: 'WEB101', topic: 'Intro',
  startAt: '2026-01-01T09:00:00Z', endAt: '2026-01-01T10:00:00Z',
  instructorId: 'i1', enrolledCount: 2, recordedCount: 0,
};
const row = (over: object = {}) => ({
  studentId: 1, registrationNumber: 'R1', studentName: 'Alice', recordId: null,
  status: null, checkInAt: null, remarks: null, coursePercentage: null, ...over,
});
const roster = (rows: object[]) => ({ session, rows });

describe('AttendanceManagementComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceManagementComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  async function create(rows: object[]) {
    const fixture = TestBed.createComponent(AttendanceManagementComponent);
    fixture.componentRef.setInput('sessionId', '5');
    fixture.detectChanges();
    http.expectOne(`${apiV2Url}/sessions/5/attendance`).flush(roster(rows));
    await fixture.whenStable();
    return fixture;
  }

  it('shows one row per enrolled student', async () => {
    const fixture = await create([row(), row({ studentId: 2, studentName: 'Bob', registrationNumber: 'R2' })]);

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Alice');
    expect(text).toContain('Bob');
    expect(fixture.componentInstance.rows.length).toBe(2);
  });

  it('cannot save until at least one student is marked', async () => {
    const fixture = await create([row()]);
    expect(fixture.componentInstance.canSave()).toBe(false);

    fixture.componentInstance.rows.at(0).controls.status.setValue('Late');
    fixture.componentInstance.refreshMarkedCount();
    expect(fixture.componentInstance.canSave()).toBe(true);
  });

  it('sends only the marked students when saving', async () => {
    const fixture = await create([row(), row({ studentId: 2, studentName: 'Bob', registrationNumber: 'R2' })]);
    fixture.componentInstance.rows.at(1).controls.status.setValue('Present');
    fixture.componentInstance.refreshMarkedCount();

    fixture.componentInstance.save();

    const req = http.expectOne(`${apiV2Url}/sessions/5/attendance`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ entries: [{ studentId: 2, status: 'Present', remarks: null }] });
    req.flush(roster([row(), row({ studentId: 2, status: 'Present', recordId: 10 })]));
  });

  it('"mark everyone present" fills every row', async () => {
    const fixture = await create([row(), row({ studentId: 2 })]);

    fixture.componentInstance.setAll('Present');

    expect(fixture.componentInstance.rows.controls.every((g) => g.controls.status.value === 'Present')).toBe(true);
    expect(fixture.componentInstance.markedCount()).toBe(2);
  });

  it('shows the API problem message when saving fails', async () => {
    const fixture = await create([row({ status: 'Present' })]);

    fixture.componentInstance.save();
    http.expectOne(`${apiV2Url}/sessions/5/attendance`).flush(
      { title: 'Conflict', detail: 'Attendance cannot be recorded before the session starts.' },
      { status: 409, statusText: 'Conflict' },
    );

    expect(fixture.componentInstance.error()).toBe('Attendance cannot be recorded before the session starts.');
  });
});
