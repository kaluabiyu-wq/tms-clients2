import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Login, register and refresh must never carry a token or trigger a refresh loop.
  if (req.url.includes('/auth/')) return next(req);

  const withToken = (token: string | null) =>
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(withToken(auth.getAccessToken())).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return from(auth.refresh()).pipe(
          switchMap((ok) =>
            ok ? next(withToken(auth.getAccessToken())) : throwError(() => err)
          )
        );
      }
      return throwError(() => err);
    })
  );
};