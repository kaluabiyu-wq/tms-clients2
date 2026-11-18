import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardSummaryComponent } from './dashboard-summary';
import { ReportService } from '../../services/report.service';

describe('DashboardSummary', () => {
  let component: DashboardSummaryComponent;
  let fixture: ComponentFixture<DashboardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSummaryComponent],
      providers: [{ provide: ReportService, useValue: { dashboard: () => of({ totalStudents: 12, totalCourses: 3, averageAttendancePercent: 85 }) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('loads institutional summary metrics', () => {
    expect(component.summary()?.totalStudents).toBe(12);
    expect(component.summary()?.totalCourses).toBe(3);
  });
});
