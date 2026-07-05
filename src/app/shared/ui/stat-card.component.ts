import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/** A single KPI tile: label, value, and a directional delta chip. */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-5">
      <div class="flex items-start justify-between">
        <p class="text-sm font-medium text-ink-500">{{ label }}</p>
        <span class="rounded-lg bg-brand-50 p-2 text-brand-600">
          <lucide-icon [name]="icon" [size]="18"></lucide-icon>
        </span>
      </div>
      <p class="mt-3 text-2xl font-semibold tracking-tight text-ink-900">{{ display() }}</p>
      <div class="mt-2 flex items-center gap-1.5 text-sm">
        <lucide-icon [name]="up() ? 'trending-up' : 'trending-down'" [size]="16"
          [class]="up() ? 'text-emerald-600' : 'text-red-600'"></lucide-icon>
        <span [class]="up() ? 'text-emerald-600' : 'text-red-600'" class="font-medium">
          {{ change > 0 ? '+' : '' }}{{ change }}%
        </span>
        <span class="text-ink-400">vs last month</span>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) set value(v: number) { this._value.set(v); }
  @Input() change = 0;
  @Input() format: 'number' | 'currency' | 'percent' = 'number';

  private readonly _value = signal(0);
  readonly up = computed(() => this.change >= 0);
  readonly display = computed(() => {
    const v = this._value();
    if (this.format === 'currency') return `$${v.toLocaleString('en-US')}`;
    if (this.format === 'percent') return `${v}%`;
    return v.toLocaleString('en-US');
  });
}
