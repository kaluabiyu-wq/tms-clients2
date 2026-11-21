import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminCourseListComponent } from './admin-course-list.component';
import { CourseService } from '../../services/course.service';

describe('AdminCourseListComponent', () => {
  let component: AdminCourseListComponent;
  let fixture: ComponentFixture<AdminCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCourseListComponent],
      providers: [
        {
          provide: CourseService,
          useValue: {
            getAll: () => of([]),
            update: () => of(void 0),
            delete: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
