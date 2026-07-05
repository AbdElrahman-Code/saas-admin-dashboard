import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthUser, Role } from '../models';

/** Privilege ordering — a higher index outranks a lower one. */
const ROLE_RANK: Record<Role, number> = { member: 0, manager: 1, admin: 2 };

const STORAGE_KEY = 'nimbus.auth';

/**
 * AuthService
 * Signals-first auth state. In a real backend this would call POST /auth/login;
 * here we accept any of the seeded emails with the demo password and mint a
 * fake JWT so the interceptor wiring is exercised exactly as it would be in prod.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  // Private writable state, exposed read-only to the rest of the app.
  private readonly _user = signal<AuthUser | null>(this.restore());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly role = computed<Role | null>(() => this._user()?.role ?? null);

  /** Demo credential map. Replace with a real API call in production. */
  private readonly demoAccounts: Record<string, Omit<AuthUser, 'token'>> = {
    'amara.okafor@nimbus.io': { id: '1', name: 'Amara Okafor', email: 'amara.okafor@nimbus.io', role: 'admin' },
    'daniel.reyes@nimbus.io': { id: '2', name: 'Daniel Reyes', email: 'daniel.reyes@nimbus.io', role: 'manager' },
    'priya.nair@nimbus.io': { id: '3', name: 'Priya Nair', email: 'priya.nair@nimbus.io', role: 'member' }
  };

  login(email: string, password: string): { ok: boolean; error?: string } {
    const account = this.demoAccounts[email.trim().toLowerCase()];
    if (!account || password !== 'nimbus123') {
      return { ok: false, error: 'Invalid email or password.' };
    }
    const authUser: AuthUser = { ...account, token: this.fakeJwt(account.id, account.role) };
    this._user.set(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return { ok: true };
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  token(): string | null {
    return this._user()?.token ?? null;
  }

  /** True when the current user's role meets or exceeds `required`. */
  hasRole(required: Role): boolean {
    const current = this.role();
    return current !== null && ROLE_RANK[current] >= ROLE_RANK[required];
  }

  private restore(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  /** Minimal unsigned JWT-shaped token — for demo transport only. */
  private fakeJwt(sub: string, role: Role): string {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub, role, iat: Date.now() }));
    return `${header}.${payload}.demo`;
  }
}
