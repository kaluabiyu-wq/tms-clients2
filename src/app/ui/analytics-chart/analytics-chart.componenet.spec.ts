import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChartComponenet } from './analytics-chart.componenet';

describe('AnalyticsChartComponenet', () => {
  let component: AnalyticsChartComponenet;
  let fixture: ComponentFixture<AnalyticsChartComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsChartComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsChartComponenet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
