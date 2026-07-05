import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';
import { ShellComponent } from '@shared/layout/shell.component';

/**
 * Route map.
 * - /login is public.
 * - Everything under ShellComponent requires auth (authGuard).
 * - /team additionally requires manager+ (roleGuard).
 * Feature components are lazy-loaded for smaller initial bundles.
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'team',
        canActivate: [roleGuard('manager')],
        loadComponent: () => import('@features/users/users-list.component').then((m) => m.UsersListComponent)
      }
    ]
  },
  {
    path: 'forbidden',
    loadComponent: () => import('@features/forbidden.component').then((m) => m.ForbiddenComponent)
  },
  { path: '**', redirectTo: '' }
];
