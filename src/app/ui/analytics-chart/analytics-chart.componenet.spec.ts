import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChartComponent } from './analytics-chart.componenet';
import { Enrollment } from '../../models/enrollment.model';

describe('AnalyticsChartComponent', () => {
  let component: AnalyticsChartComponent;
  let fixture: ComponentFixture<AnalyticsChartComponent>;

  const mockData: Enrollment[] = [
    { id: '1', studentId: 11, studentName: 'Abeba', courseId: 101, courseName: 'Intro to CS', status: 'Approved', enrolledAt: '2026-08-12T10:00:00Z' },
    { id: '2', studentId: 12, studentName: 'Kebede', courseId: 102, courseName: 'Data Structures', status: 'Pending', enrolledAt: '2026-08-12T10:05:00Z' },
    { id: '3', studentId: 13, studentName: 'Sara', courseId: 103, courseName: 'Algorithms', status: 'Rejected', enrolledAt: '2026-08-12T10:10:00Z' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsChartComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', mockData);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total record count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Total records: 3');
  });

  it('computes bar heights from status counts', () => {
      expect(component.approvedHeight()).toBe(20);
    expect(component.pendingHeight()).toBe(20);
    expect(component.rejectedHeight()).toBe(20);
  });
});