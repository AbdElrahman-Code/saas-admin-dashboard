import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Centralised HTTP error handling.
 * - 401 => session is dead, force a logout.
 * - Everything else => normalise into a human-readable message that the
 *   NgRx failure actions can surface to the UI.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        message = 'Cannot reach the server. Is the mock API running on port 3000?';
      } else if (error.status === 401) {
        auth.logout();
        message = 'Your session has expired. Please sign in again.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      return throwError(() => ({ status: error.status, message }));
    })
  );
};
