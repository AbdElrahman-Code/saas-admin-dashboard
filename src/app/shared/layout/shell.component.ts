import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

/** Authenticated app frame: sidebar + topbar + routed content. */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar class="hidden md:block"></app-sidebar>
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-topbar></app-topbar>
        <main class="flex-1 overflow-y-auto bg-ink-50 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {}
