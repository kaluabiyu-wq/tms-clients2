
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CourseDetailComponent } from './course-detail.component';
import { CourseService } from '../../services/course.service';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  const mockCourseService = {
    getById: vi.fn().mockReturnValue(
      of({
        id: '1',
        title: 'Introduction to Programming',
        enrollments: [
          {
            registrationNumber: 'REG001',
            name: 'Student One',
          },
          {
            registrationNumber: 'REG002',
            name: 'Student Two',
          },
        ],
      })
    ),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: mockCourseService,
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

  it('should load the course using the supplied ID', () => {
    expect(mockCourseService.getById).toHaveBeenCalledWith('1');
  });

  it('should populate the enrollment data source', () => {
    expect(component.dataSource.data).toHaveLength(2);
  });

  it('should display the enrollment names in the data source', () => {
    expect(component.dataSource.data.map(student => student.name))
      .toEqual(['Student One', 'Student Two']);
  });
});
