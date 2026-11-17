import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGradesComponent } from './student-grades.component';

describe('StudentGradesComponent', () => {
  let component: StudentGradesComponent;
  let fixture: ComponentFixture<StudentGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentGradesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentGradesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
