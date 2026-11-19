
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { InstructorDashboardComponent } from './instructur-dashboard.componenet';
import { EnrollmentStore } from '../../store/enrollment.store';
import { LiveSyncService } from '../../services/live-sync.service';

describe('InstructorDashboardComponent', () => {
  let component: InstructorDashboardComponent;
  let fixture: ComponentFixture<InstructorDashboardComponent>;

  const mockEnrollments = [
    {
      id: 1,
      registrationNumber: 'REG001',
      studentName: 'Student One',
      status: 'Pending',
    },
    {
      id: 2,
      registrationNumber: 'REG002',
      studentName: 'Student Two',
      status: 'Approved',
    },
    {
      id: 3,
      registrationNumber: 'REG003',
      studentName: 'Student Three',
      status: 'Pending',
    },
  ];

  const mockEnrollmentStore = {
    entities: signal(mockEnrollments),
    pendingCount: signal(2),
    isLoading: signal(false),
    error: signal(null),

    loadEnrollments: vi.fn(),
    listenForLiveUpdates: vi.fn(),
    approveEnrollment: vi.fn(),
  };

  const mockLiveSyncService = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    events$: {
      subscribe: vi.fn(),
    },
    connectionState: signal('disconnected'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [InstructorDashboardComponent],
      providers: [
        {
          provide: EnrollmentStore,
          useValue: mockEnrollmentStore,
        },
        {
          provide: LiveSyncService,
          useValue: mockLiveSyncService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorDashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enrollments on initialization', () => {
    expect(mockEnrollmentStore.loadEnrollments).toHaveBeenCalled();
  });

  it('should initialize live updates on initialization', () => {
    expect(mockEnrollmentStore.listenForLiveUpdates).toHaveBeenCalled();
  });

  it('should inject the enrollment store', () => {
    expect(component.store).toBe(mockEnrollmentStore);
  });

  it('should display the total enrollment count', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.kpi-card .kpi-value')?.textContent?.trim())
      .toBe('3');
  });

  it('should display the pending enrollment count', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.kpi-card.pending .kpi-value')?.textContent?.trim())
      .toBe('2');
  });
});
