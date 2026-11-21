import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { InstructorDashboardComponent } from './instructur-dashboard.componenet';
import { EnrollmentStore } from '../../store/enrollment.store';

describe('InstructorDashboardComponent', () => {
  let component: InstructorDashboardComponent;
  let fixture: ComponentFixture<InstructorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: EnrollmentStore,
          useValue: {
            entities: signal([]),
            isLoading: signal(false),
            error: signal(null),
            pendingCount: signal(0),
            approvingId: signal(null),
            loadEnrollments: () => {},
            listenForLiveUpdates: () => {},
            approveEnrollment: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
