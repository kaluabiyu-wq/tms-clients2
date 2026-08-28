import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';

import { InstructorDashboardComponent } from './instructur-dashboard.componenet';
import { LiveSyncService } from '../../services/live-sync.service';

describe('InstructorDashboardComponent', () => {
  let component: InstructorDashboardComponent;
  let fixture: ComponentFixture<InstructorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashboardComponent],
      providers: [
        {
          provide: LiveSyncService,
          useValue: {
            connect: () => {},
            disconnect: () => {},
            events$: EMPTY,                   
            connectionState: () => 'disconnected',
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