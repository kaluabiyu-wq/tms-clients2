import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCardComponent } from './course-card.component';
import { provideRouter } from '@angular/router';

describe("CourseCardComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourseCardComponent],
      providers: [provideRouter([])],
    });
  });

  it("should display the course title", async () => {
    const fixture = TestBed.createComponent(CourseCardComponent);

    fixture.componentRef.setInput("course", {
      id: 1,
      code: "CSE-101",
      title: "Advanced Web Dev",
      maxCapacity: 30,
      enrollmentCount: 12,
    });

     fixture.detectChanges();
    await fixture.whenStable();
     fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("Advanced Web Dev");
  });

  it("should emit enrollClicked event when button is clicked", async () => {
    const fixture = TestBed.createComponent(CourseCardComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput("course", {
      id: 1,
      code: "CSE-101",
      title: "Advanced Web Dev",
      maxCapacity: 30,
      enrollmentCount: 12,
    });

  
     fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    let emittedCourse: any = null;
    component.enrollClicked.subscribe((c: any) => (emittedCourse = c));

    const button = fixture.nativeElement.querySelector(
      "button",
    ) as HTMLButtonElement;
    button.click();

     fixture.detectChanges();
    await fixture.whenStable();

    expect(emittedCourse).toBeTruthy();
    expect(emittedCourse.title).toBe("Advanced Web Dev");
  });
});