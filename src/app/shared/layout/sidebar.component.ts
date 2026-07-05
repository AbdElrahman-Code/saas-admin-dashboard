import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HasRoleDirective } from '@shared/directives/has-role.directive';

interface NavItem { label: string; path: string; icon: string; }

/** Primary navigation. The "Team" link is manager+ only via *appHasRole. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, HasRoleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="flex h-full w-64 flex-col border-r border-ink-200 bg-white">
      <div class="flex h-16 items-center gap-2 px-6">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
          <lucide-icon name="cloud" [size]="20"></lucide-icon>
        </span>
        <span class="text-lg font-semibold tracking-tight">Nimbus</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <a *ngFor="let item of items" [routerLink]="item.path" routerLinkActive="bg-brand-50 text-brand-700"
          [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50">
          <lucide-icon [name]="item.icon" [size]="18"></lucide-icon>
          {{ item.label }}
        </a>

        <a *appHasRole="'manager'" routerLink="/team" routerLinkActive="bg-brand-50 text-brand-700"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50">
          <lucide-icon name="users" [size]="18"></lucide-icon>
          Team
          <span class="ml-auto rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">RBAC</span>
        </a>
      </nav>

      <div class="border-t border-ink-200 p-4 text-xs text-ink-400">
        Nimbus Console · v1.0
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly items: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' }
  ];
}
