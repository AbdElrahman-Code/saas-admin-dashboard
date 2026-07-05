import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-6">
      <div class="relative w-full max-w-sm">
        <lucide-icon name="search" [size]="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"></lucide-icon>
        <input type="search" placeholder="Search the console…"
          class="input pl-9" aria-label="Global search" />
      </div>

      <div class="flex items-center gap-4">
        <button class="btn-ghost p-2" aria-label="Notifications">
          <lucide-icon name="bell" [size]="18"></lucide-icon>
        </button>

        <div class="flex items-center gap-3" *ngIf="auth.user() as u">
          <div class="text-right">
            <p class="text-sm font-medium leading-tight">{{ u.name }}</p>
            <p class="text-xs capitalize text-ink-400">{{ u.role }}</p>
          </div>
          <span class="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {{ initials(u.name) }}
          </span>
          <button (click)="auth.logout()" class="btn-ghost p-2" aria-label="Sign out">
            <lucide-icon name="log-out" [size]="18"></lucide-icon>
          </button>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent {
  readonly auth = inject(AuthService);
  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }
}
