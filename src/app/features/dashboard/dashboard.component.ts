import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { StatCardComponent } from '@shared/ui/stat-card.component';
import { MetricsService } from '@core/services/metrics.service';
import { DashboardMetrics } from '@core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6">
      <header>
        <h1 class="text-2xl font-semibold tracking-tight">Overview</h1>
        <p class="text-sm text-ink-500">Your SaaS at a glance — updated live from the metrics API.</p>
      </header>

      <!-- Loading skeleton -->
      <div *ngIf="loading()" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div *ngFor="let i of [1,2,3,4]" class="card h-32 animate-pulse bg-ink-100/60"></div>
      </div>

      <!-- Error -->
      <p *ngIf="error()" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error() }}</p>

      <ng-container *ngIf="metrics() as m">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <app-stat-card label="Monthly recurring revenue" icon="dollar-sign"
            [value]="m.mrr" [change]="m.mrrChangePct" format="currency"></app-stat-card>
          <app-stat-card label="Active users" icon="users"
            [value]="m.activeUsers" [change]="m.activeUsersChangePct"></app-stat-card>
          <app-stat-card label="Churn rate" icon="trending-down"
            [value]="m.churnPct" [change]="m.churnChangePct" format="percent"></app-stat-card>
          <app-stat-card label="Open tickets" icon="life-buoy"
            [value]="m.openTickets" [change]="m.openTicketsChangePct"></app-stat-card>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="card p-6 lg:col-span-2">
            <h2 class="text-sm font-semibold text-ink-700">Revenue (last 6 months)</h2>
            <div class="mt-4 h-72">
              <canvas baseChart type="line" [data]="revenueData" [options]="lineOptions"></canvas>
            </div>
          </div>
          <div class="card p-6">
            <h2 class="text-sm font-semibold text-ink-700">Signups by plan</h2>
            <div class="mt-4 h-72">
              <canvas baseChart type="doughnut" [data]="planData" [options]="doughnutOptions"></canvas>
            </div>
          </div>
        </div>
      </ng-container>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  private readonly metricsApi = inject(MetricsService);

  readonly metrics = signal<DashboardMetrics | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  revenueData: ChartData<'line'> = { labels: [], datasets: [] };
  planData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  readonly lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { callback: (v) => `$${Number(v) / 1000}k` }, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnInit(): void {
    this.metricsApi.getMetrics().subscribe({
      next: (m) => {
        this.metrics.set(m);
        this.hydrateCharts(m);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Failed to load metrics.');
        this.loading.set(false);
      }
    });
  }

  /** Map raw metrics into Chart.js datasets with brand colours. */
  private hydrateCharts(m: DashboardMetrics): void {
    this.revenueData = {
      labels: m.revenueSeries.map((p) => p.month),
      datasets: [{
        data: m.revenueSeries.map((p) => p.value),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#4f46e5'
      }]
    };
    this.planData = {
      labels: m.signupsByPlan.map((p) => p.plan),
      datasets: [{
        data: m.signupsByPlan.map((p) => p.value),
        backgroundColor: ['#6366f1', '#0ea5e9', '#10b981'],
        borderWidth: 0
      }]
    };
  }
}
