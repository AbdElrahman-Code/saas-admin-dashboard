import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {
  LucideAngularModule, Cloud, LayoutDashboard, Users, Search, Bell, LogOut,
  DollarSign, TrendingUp, TrendingDown, LifeBuoy, LoaderCircle, UserPlus,
  Pencil, Trash2, X, ShieldAlert
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { usersFeature } from '@store/users/users.reducer';
import { UsersEffects } from '@store/users/users.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router with input binding (route params bind straight to @Input()).
    provideRouter(routes, withComponentInputBinding()),

    // HttpClient with the auth + error interceptors in order.
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    // NgRx store + effects (+ devtools in dev only).
    provideStore({ [usersFeature.name]: usersFeature.reducer }),
    provideEffects([UsersEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),

    // Register Chart.js controllers/scales for ng2-charts (v5).
    provideCharts(withDefaultRegisterables()),

    // Register only the icons we actually use (tree-shakeable).
    importProvidersFrom(
      LucideAngularModule.pick({
        Cloud, LayoutDashboard, Users, Search, Bell, LogOut, DollarSign,
        TrendingUp, TrendingDown, LifeBuoy, LoaderCircle, UserPlus, Pencil,
        Trash2, X, ShieldAlert
      })
    )
  ]
};
