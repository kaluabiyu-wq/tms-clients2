import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { CourseService } from "../services/course.service";
import { pipe, tap, concatMap, catchError, EMPTY } from "rxjs";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { removeEntity, setAllEntities, withEntities } from "@ngrx/signals/entities";
import { Course } from "../models/course.model";

type CourseState = {
  isLoading: boolean;
  error: string | null;
};

const initialState: CourseState = {
  isLoading: false,
  error: null,
};

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Course>(),
  withMethods((store, svc = inject(CourseService)) => ({
    loadCourses: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          svc.getAll().pipe(
            tap((rows) => patchState(store, setAllEntities(rows), { isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: 'Could not load courses.' });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    deleteCourse(id: number) {
      const previousSnapshot = store.entities();

      patchState(store, removeEntity(id));

      svc.delete(id).pipe(
        catchError(err => {
          patchState(store, setAllEntities(previousSnapshot));
          patchState(store, {
            error: err.error?.detail ?? 'Cannot delete course: active student enrollments exist.'
          });
          return EMPTY;
        })
      ).subscribe();
    }
  }))
);