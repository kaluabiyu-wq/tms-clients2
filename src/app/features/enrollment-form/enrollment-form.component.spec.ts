import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EnrollmentFormComponent } from './enrollment-form.component';
import { CourseService } from '../../services/course.service';
import { StudentProfileService } from '../../services/student-profile.service';

describe('EnrollmentFormComponent', () => {
  let component: EnrollmentFormComponent;
  let fixture: ComponentFixture<EnrollmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: {}, params: {}, data: {} },
            queryParamMap: of({ get: () => null }),
          },
        },
        {
          provide: CourseService,
          useValue: {
            getAll: () => of([]),
            enroll: () => of({}),
          },
        },
        {
          provide: StudentProfileService,
          useValue: {
            getMyProfile: () => of({
              account: { email: 'student@example.test' },
              student: { registrationNumber: 'STU-001', name: 'Test Student', status: 'Active' },
              enrollments: [],
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
