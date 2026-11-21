import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { StudentDashboardComponent } from './student-dashboard.component';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';

describe('StudentDashboardComponent', () => {
  let component: StudentDashboardComponent;
  let fixture: ComponentFixture<StudentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseStore,
          useValue: {
            entities: signal([]),
            isLoading: signal(false),
            error: signal(null),
            loadCourses: () => {},
            deleteCourse: () => {},
          },
        },
        {
          provide: AuthService,
          useValue: { currentUser: signal(null) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
