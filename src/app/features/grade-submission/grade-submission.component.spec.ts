import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GradeSubmissionComponent } from './grade-submission.component';
import { CourseService } from '../../services/course.service';
import { AssessmentService } from '../../services/assessment.service';

describe('GradeSubmissionComponent', () => {
  let fixture: ComponentFixture<GradeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeSubmissionComponent],
      providers: [
        { provide: CourseService, useValue: { getAll: () => of([]) } },
        { provide: AssessmentService, useValue: {
          list: () => of({ data: [] }),
          submissions: () => of([]),
          grade: () => of({}),
        } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeSubmissionComponent);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
