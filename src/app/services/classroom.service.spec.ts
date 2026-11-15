import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassroomService } from './classroom.service';
import { apiV2Url } from './api-url';

describe('ClassroomService', () => {
  let service: ClassroomService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClassroomService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists classrooms from the v2 endpoint with paging params', () => {
    service.list(2, 10).subscribe();

    const req = http.expectOne((r) => r.url === `${apiV2Url}/classrooms`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');
    req.flush({ items: [], totalCount: 0, page: 2, pageSize: 10 });
  });

  it('posts a new classroom', () => {
    service.create({ name: 'Lab 1', location: 'A', capacity: 20 }).subscribe();

    const req = http.expectOne(`${apiV2Url}/classrooms`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Lab 1', location: 'A', capacity: 20 });
    req.flush({});
  });

  it('puts an update to the classroom id', () => {
    service.update(5, { name: 'Lab 1', location: 'A', capacity: 20, isActive: false }).subscribe();

    const req = http.expectOne(`${apiV2Url}/classrooms/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.isActive).toBe(false);
    req.flush({});
  });

  it('targets /api/v2 when the environment uses /api/v1', () => {
    expect(apiV2Url.endsWith('/api/v2')).toBe(true);
  });
});
