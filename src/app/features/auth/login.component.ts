import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid min-h-screen lg:grid-cols-2">
      <!-- Brand panel -->
      <div class="relative hidden flex-col justify-between bg-brand-700 p-12 text-white lg:flex">
        <div class="flex items-center gap-2">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
            <lucide-icon name="cloud" [size]="20"></lucide-icon>
          </span>
          <span class="text-lg font-semibold">Nimbus</span>
        </div>
        <div>
          <h1 class="text-3xl font-semibold leading-tight">Run your SaaS from one calm console.</h1>
          <p class="mt-4 max-w-md text-brand-100">
            Revenue, retention and team access — measured, audited and role-aware.
          </p>
        </div>
        <p class="text-sm text-brand-200">Trusted by 1,800+ operators worldwide.</p>
      </div>

      <!-- Form panel -->
      <div class="flex items-center justify-center p-6">
        <div class="w-full max-w-sm">
          <h2 class="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p class="mt-1 text-sm text-ink-500">Welcome back. Enter your credentials to continue.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="mt-8 space-y-4" novalidate>
            <div>
              <label class="label" for="email">Work email</label>
              <input id="email" type="email" formControlName="email" class="input"
                placeholder="amara.okafor@nimbus.io" autocomplete="username" />
              <p *ngIf="invalid('email')" class="mt-1 text-xs text-red-600">A valid email is required.</p>
            </div>

            <div>
              <label class="label" for="password">Password</label>
              <input id="password" type="password" formControlName="password" class="input"
                placeholder="••••••••" autocomplete="current-password" />
              <p *ngIf="invalid('password')" class="mt-1 text-xs text-red-600">Password is required.</p>
            </div>

            <p *ngIf="error()" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error() }}</p>

            <button type="submit" class="btn-primary w-full" [disabled]="loading()">
              <lucide-icon *ngIf="loading()" name="loader-circle" [size]="16" class="animate-spin"></lucide-icon>
              {{ loading() ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <div class="mt-6 rounded-lg border border-ink-200 bg-ink-50 p-3 text-xs text-ink-500">
            <p class="font-medium text-ink-600">Demo accounts (password: <span class="font-mono">nimbus123</span>)</p>
            <p class="mt-1">amara.okafor&#64;nimbus.io — admin · daniel.reyes&#64;nimbus.io — manager · priya.nair&#64;nimbus.io — member</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  invalid(control: 'email' | 'password'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    // Simulate network latency so loading state is visible/testable.
    const { email, password } = this.form.getRawValue();
    setTimeout(() => {
      const result = this.auth.login(email, password);
      this.loading.set(false);
      if (result.ok) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.error.set(result.error ?? 'Sign in failed.');
      }
    }, 500);
  }
}
