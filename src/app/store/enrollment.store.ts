import { computed, inject } from '@angular/core';
import {
  signalStore, withComputed, withMethods, patchState, withState,
} from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY, switchMap } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';
import { LiveSyncService } from '../services/live-sync.service';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({ isLoading: false, error: null as string | null, approvingId: null as number | null }),
  withEntities<Enrollment>(),
  withComputed(store => ({
    pendingCount: computed(() => store.entities().filter(e => e.status === 'Pending').length),
  })),
  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap(event => patchState(store, updateEntity({ id: event.id, changes: { status: event.status } }))),
      ),
    ),

    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() => api.getAll().pipe(
          tap(rows => patchState(store, setAllEntities(rows), { isLoading: false })),
          catchError(err => {
            patchState(store, { isLoading: false, error: err?.error?.detail ?? err?.message ?? 'Unable to load enrollment records.' });
            return EMPTY;
          }),
        )),
      ),
    ),

    approveEnrollment: rxMethod<number>(
      pipe(
        tap(id => {
          patchState(store, { approvingId: id, error: null });
        }),
        concatMap(id => api.approve(id).pipe(
          tap(() => patchState(store,
            updateEntity({ id, changes: { status: 'Approved' } }),
            { approvingId: null },
          )),
          catchError(err => {
            patchState(store, {
              approvingId: null,
              error: err?.error?.detail ?? err?.error?.message ?? 'The enrollment could not be approved. Refresh and try again.',
            });
            return EMPTY;
          }),
        )),
      ),
    ),
  })),
);
