import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { CourseDetailComponent } from './course-detail.component';
import { CourseService } from '../../services/course.service';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: {
            getById: () => of({
              id: 1,
              code: 'TEST101',
              title: 'Test course',
              description: '',
              maxCapacity: 10,
              enrollmentCount: 0,
              enrollments: [],
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
