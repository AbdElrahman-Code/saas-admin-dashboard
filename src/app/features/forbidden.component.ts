import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

/** 403 screen shown when roleGuard rejects access. */
@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid min-h-screen place-items-center bg-ink-50 p-6 text-center">
      <div class="max-w-sm">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <lucide-icon name="shield-alert" [size]="26"></lucide-icon>
        </span>
        <h1 class="mt-5 text-xl font-semibold">Access restricted</h1>
        <p class="mt-2 text-sm text-ink-500">You don't have permission to view this area. Ask an administrator if you need access.</p>
        <a routerLink="/dashboard" class="btn-primary mt-6 inline-flex">Back to dashboard</a>
      </div>
    </div>
  `
})
export class ForbiddenComponent {}
