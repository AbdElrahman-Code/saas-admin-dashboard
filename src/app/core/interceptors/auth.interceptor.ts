import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Attaches the bearer token to every outgoing request.
 * Functional interceptor (Angular 15+) — registered in app.config.ts.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  if (!token) {
    return next(req);
  }
  const authed = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(authed);
};
