import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';
import { UsersActions } from '@store/users/users.actions';
import {
  selectFilteredUsers, selectUsersLoading, selectUsersSaving, selectUsersError, selectUsersSummary
} from '@store/users/users.selectors';
import { Role, User, UserDraft } from '@core/models';
import { HasRoleDirective } from '@shared/directives/has-role.directive';
import { UserFormComponent } from './user-form.component';

type RoleFilter = 'all' | 'admin' | 'manager' | 'member';

/**
 * Team management — the NgRx showcase screen.
 * Reads a derived view-model from the store and dispatches CRUD actions.
 * Destructive actions are gated behind *appHasRole="'admin'".
 */
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, HasRoleDirective, UserFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Team</h1>
          <p class="text-sm text-ink-500" *ngIf="summary$ | async as s">
            {{ s.total }} members · {{ s.active }} active · {{ s.invited }} invited · {{ s.suspended }} suspended
          </p>
        </div>
        <button *appHasRole="'manager'" class="btn-primary" (click)="openCreate()">
          <lucide-icon name="user-plus" [size]="16"></lucide-icon> Invite member
        </button>
      </header>

      <!-- Filters -->
      <div class="card flex flex-wrap items-center gap-3 p-4">
        <div class="relative flex-1 min-w-[220px]">
          <lucide-icon name="search" [size]="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"></lucide-icon>
          <input class="input pl-9" placeholder="Search name, email or department…"
            (input)="onSearch($event)" aria-label="Search members" />
        </div>
        <div class="flex items-center gap-1 rounded-lg border border-ink-200 p-1">
          <button *ngFor="let r of roleTabs" (click)="onRoleFilter(r.value)"
            [class]="activeRole() === r.value ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-100'"
            class="rounded-md px-3 py-1.5 text-sm font-medium capitalize transition">
            {{ r.label }}
          </button>
        </div>
      </div>

      <p *ngIf="error$ | async as err" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ err }}</p>

      <!-- Data table -->
      <div class="card overflow-hidden">
        <div *ngIf="loading$ | async" class="p-10 text-center text-sm text-ink-400">
          <lucide-icon name="loader-circle" [size]="20" class="mx-auto animate-spin"></lucide-icon>
          <p class="mt-2">Loading team…</p>
        </div>

        <table *ngIf="!(loading$ | async)" class="w-full text-left text-sm">
          <thead class="border-b border-ink-200 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th class="px-5 py-3 font-medium">Member</th>
              <th class="px-5 py-3 font-medium">Role</th>
              <th class="px-5 py-3 font-medium">Department</th>
              <th class="px-5 py-3 font-medium">Status</th>
              <th class="px-5 py-3 font-medium">Last active</th>
              <th class="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink-100">
            <tr *ngFor="let u of (users$ | async); trackBy: trackById" class="hover:bg-ink-50/60">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <span class="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-white"
                    [style.backgroundColor]="u.avatarColor">{{ initials(u.name) }}</span>
                  <div>
                    <p class="font-medium text-ink-900">{{ u.name }}</p>
                    <p class="text-xs text-ink-400">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3"><span class="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-700">{{ u.role }}</span></td>
              <td class="px-5 py-3 text-ink-600">{{ u.department }}</td>
              <td class="px-5 py-3">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium capitalize" [ngClass]="statusClass(u.status)">
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>{{ u.status }}
                </span>
              </td>
              <td class="px-5 py-3 text-ink-500">{{ u.lastActive | date: 'MMM d, y' }}</td>
              <td class="px-5 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button *appHasRole="'manager'" class="btn-ghost p-1.5" (click)="openEdit(u)" aria-label="Edit">
                    <lucide-icon name="pencil" [size]="16"></lucide-icon>
                  </button>
                  <button *appHasRole="'admin'" class="btn-ghost p-1.5 text-red-600 hover:bg-red-50" (click)="confirmDelete(u)" aria-label="Delete">
                    <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="(users$ | async)?.length === 0">
              <td colspan="6" class="px-5 py-12 text-center text-ink-400">
                <lucide-icon name="users" [size]="28" class="mx-auto"></lucide-icon>
                <p class="mt-2 font-medium text-ink-600">No members match your filters</p>
                <p class="text-sm">Try a different search term or clear the role filter.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <app-user-form *ngIf="formOpen()" [user]="selected()" [saving]="(saving$ | async) ?? false"
      (submitForm)="onSubmit($event)" (cancel)="closeForm()"></app-user-form>
  `
})
export class UsersListComponent implements OnInit {
  private readonly store = inject(Store);

  readonly users$: Observable<User[]> = this.store.select(selectFilteredUsers);
  readonly loading$ = this.store.select(selectUsersLoading);
  readonly saving$ = this.store.select(selectUsersSaving);
  readonly error$ = this.store.select(selectUsersError);
  readonly summary$ = this.store.select(selectUsersSummary);

  readonly activeRole = signal<RoleFilter>('all');
  readonly formOpen = signal(false);
  readonly selected = signal<User | null>(null);

  readonly roleTabs: { label: string; value: RoleFilter }[] = [
    { label: 'All', value: 'all' }, { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' }, { label: 'Member', value: 'member' }
  ];

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.store.dispatch(UsersActions.setSearchTerm({ term }));
  }

  onRoleFilter(role: RoleFilter): void {
    this.activeRole.set(role);
    this.store.dispatch(UsersActions.setRoleFilter({ role }));
  }

  openCreate(): void { this.selected.set(null); this.formOpen.set(true); }
  openEdit(user: User): void { this.selected.set(user); this.formOpen.set(true); }
  closeForm(): void { this.formOpen.set(false); this.selected.set(null); }

  onSubmit(draft: UserDraft): void {
    const current = this.selected();
    if (current) {
      this.store.dispatch(UsersActions.updateUser({ id: current.id, changes: draft }));
    } else {
      this.store.dispatch(UsersActions.createUser({ draft }));
    }
    this.closeForm();
  }

  confirmDelete(user: User): void {
    if (confirm(`Remove ${user.name} from the team? This cannot be undone.`)) {
      this.store.dispatch(UsersActions.deleteUser({ id: user.id }));
    }
  }

  trackById(_index: number, user: User): string { return user.id; }
  initials(name: string): string { return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(); }

  statusClass(status: User['status']): string {
    return { active: 'text-emerald-600', invited: 'text-amber-600', suspended: 'text-red-600' }[status];
  }

  // Exposed for template typing of Role where needed.
  protected readonly Role!: Role;
}
