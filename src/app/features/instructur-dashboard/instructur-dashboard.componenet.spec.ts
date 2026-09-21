import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructurDashboardComponenet } from './instructur-dashboard.componenet';

describe('InstructurDashboardComponenet', () => {
  let component: InstructurDashboardComponenet;
  let fixture: ComponentFixture<InstructurDashboardComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructurDashboardComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructurDashboardComponenet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
