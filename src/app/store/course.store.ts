import { inject } from "@angular/core";
import { patchState, signalStore, withMethods,withState } from "@ngrx/signals";
import { CourseService } from "../services/course.service";
import { catchError, EMPTY } from "rxjs";
import {removeEntity, setAllEntities, withEntities } from "@ngrx/signals/entities";
import { Course } from "../models/course.model";


type CourseState = {
  error: string | null;
};

const initialState: CourseState = {
  error: null,
};

export const CourseStore = signalStore(
    { providedIn: 'root'},
     withState(initialState),
    withEntities<Course>(),
    withMethods((store,svc = inject(CourseService))=>( {
        deleteCourse(id: number) {
        const previousSnapshot = store.entities();

        patchState(store, removeEntity(id));

        svc.delete(id).pipe(
            catchError(err => {
                patchState(store, setAllEntities(previousSnapshot));
            patchState(store, {
                 error: 'Cannot delete course: active student enrollments exist.'
            });
            return EMPTY
            })
        ).subscribe();
        }
    }))
);
