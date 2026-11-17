import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAppealsComponent } from './grade-appeals.component';

describe('GradeAppealsComponent', () => {
  let component: GradeAppealsComponent;
  let fixture: ComponentFixture<GradeAppealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeAppealsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeAppealsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
