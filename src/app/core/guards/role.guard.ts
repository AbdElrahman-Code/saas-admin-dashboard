import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../models';

/**
 * Role-based route guard factory.
 * Usage: { path: 'team', canActivate: [roleGuard('manager')] }
 * Allows access only if the user's role meets or exceeds the minimum.
 */
export const roleGuard = (required: Role): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.hasRole(required)) {
      return true;
    }
    return router.createUrlTree(['/forbidden']);
  };
};
