import { Component,input,output } from '@angular/core';
import {Course} from "../../models/course.model"
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-course-card',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
     course = input.required<Course>();
     enrollClicked = output<Course>();
     deletedClicked = output<Course>();
     
     
}

