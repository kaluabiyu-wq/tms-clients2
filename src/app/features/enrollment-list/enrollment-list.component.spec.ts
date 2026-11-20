import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EnrollmentListComponent } from './enrollment-list.component';
import { EnrollmentStore } from '../../store/enrollment.store';

describe('EnrollmentListComponent', () => {
  let component: EnrollmentListComponent;
  let fixture: ComponentFixture<EnrollmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentListComponent],
      providers: [
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

    fixture = TestBed.createComponent(EnrollmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
