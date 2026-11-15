import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassroomManagementComponent } from './classroom-management.component';
import { apiV2Url } from '../../services/api-url';

const page = (items: unknown[]) => ({ items, totalCount: items.length, page: 1, pageSize: 50 });
const room = (over: object = {}) => ({
  id: 1, name: 'Lab 1', location: 'A', capacity: 20, isActive: true, createdAt: '2026-01-01T00:00:00Z', ...over,
});

describe('ClassroomManagementComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomManagementComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  function create() {
    const fixture = TestBed.createComponent(ClassroomManagementComponent);
    http.expectOne((r) => r.url === `${apiV2Url}/classrooms`).flush(page([room()]));
    return fixture;
  }

  it('loads and shows classrooms', async () => {
    const fixture = create();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Lab 1');
  });

  it('does not post an invalid form', async () => {
    const fixture = create();
    fixture.componentInstance.form.setValue({ name: '', location: '', capacity: 10 });
    fixture.componentInstance.create();
    http.expectNone(`${apiV2Url}/classrooms`);
    expect(fixture.componentInstance.form.touched).toBe(true);
  });

  it('shows the API problem message when create fails', async () => {
    const fixture = create();
    fixture.componentInstance.form.setValue({ name: 'Lab 1', location: '', capacity: 10 });
    fixture.componentInstance.create();

    http.expectOne({ method: 'POST', url: `${apiV2Url}/classrooms` }).flush(
      { title: 'Conflict', detail: "A classroom named 'Lab 1' already exists." },
      { status: 409, statusText: 'Conflict' },
    );

    expect(fixture.componentInstance.error()).toContain('already exists');
    expect(fixture.componentInstance.isSaving()).toBe(false);
  });

  it('toggles active state through PUT', async () => {
    const fixture = create();
    fixture.componentInstance.toggleActive(fixture.componentInstance.classrooms()[0]);

    const req = http.expectOne({ method: 'PUT', url: `${apiV2Url}/classrooms/1` });
    expect(req.request.body.isActive).toBe(false);
    req.flush(room({ isActive: false }));

    expect(fixture.componentInstance.classrooms()[0].isActive).toBe(false);
  });
});
