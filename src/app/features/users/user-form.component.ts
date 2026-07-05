import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Role, User, UserDraft, UserStatus } from '@core/models';

const PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];

/**
 * Modal form for creating or editing a team member.
 * Emits a typed UserDraft on save; the parent dispatches the NgRx action.
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4" (click)="onBackdrop($event)">
      <div class="card w-full max-w-md p-6" role="dialog" aria-modal="true">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ editing ? 'Edit member' : 'Invite member' }}</h2>
          <button class="btn-ghost p-1.5" (click)="cancel.emit()" aria-label="Close">
            <lucide-icon name="x" [size]="18"></lucide-icon>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4" novalidate>
          <div>
            <label class="label" for="name">Full name</label>
            <input id="name" class="input" formControlName="name" placeholder="Jordan Mensah" />
            <p *ngIf="invalid('name')" class="mt-1 text-xs text-red-600">Name is required.</p>
          </div>
          <div>
            <label class="label" for="email">Email</label>
            <input id="email" type="email" class="input" formControlName="email" placeholder="jordan@nimbus.io" />
            <p *ngIf="invalid('email')" class="mt-1 text-xs text-red-600">A valid email is required.</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label" for="role">Role</label>
              <select id="role" class="input" formControlName="role">
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="label" for="status">Status</label>
              <select id="status" class="input" formControlName="status">
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div>
            <label class="label" for="department">Department</label>
            <input id="department" class="input" formControlName="department" placeholder="Engineering" />
            <p *ngIf="invalid('department')" class="mt-1 text-xs text-red-600">Department is required.</p>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" class="btn-ghost" (click)="cancel.emit()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="saving">
              <lucide-icon *ngIf="saving" name="loader-circle" [size]="16" class="animate-spin"></lucide-icon>
              {{ editing ? 'Save changes' : 'Send invite' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() saving = false;
  @Input() set user(value: User | null) {
    this.editing = !!value;
    if (value) {
      this.form.patchValue(value);
    }
  }

  @Output() submitForm = new EventEmitter<UserDraft>();
  @Output() cancel = new EventEmitter<void>();

  editing = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['member' as Role, [Validators.required]],
    status: ['invited' as UserStatus, [Validators.required]],
    department: ['', [Validators.required]]
  });

  invalid(control: 'name' | 'email' | 'role' | 'status' | 'department'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.dirty || c.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    // Assign a deterministic-ish avatar colour for new members.
    const avatarColor = PALETTE[value.name.length % PALETTE.length];
    this.submitForm.emit({ ...value, avatarColor });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
