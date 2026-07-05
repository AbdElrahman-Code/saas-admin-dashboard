# Nimbus — SaaS Admin Dashboard

A role-based admin console for a B2B SaaS product. Built with **Angular 17** (standalone components + Signals), **NgRx** for state, **Tailwind CSS** for styling, and a **json-server** mock API.

> Portfolio project 1 of 6. Demonstrates Signals, NgRx (actions/reducers/effects/selectors), functional HTTP interceptors, route + structural-directive RBAC, Reactive Forms, and Chart.js dashboards.

---

## Features

- **Authentication** — Signals-based `AuthService`, token persistence, route guard with `returnUrl`.
- **Role-based access control (RBAC)** — three roles (`admin` > `manager` > `member`), enforced at the route level (`roleGuard`) and in templates (`*appHasRole`).
- **Dashboard** — KPI cards with deltas plus a revenue line chart and signups-by-plan doughnut (Chart.js / ng2-charts).
- **Team management (CRUD)** — data table with live search + role filter, create/edit via a Reactive Form modal, optimistic-friendly NgRx flow, confirm-on-delete.
- **HTTP interceptors** — one attaches the bearer token, one centralises error handling (401 → forced logout, friendly messages).
- **UX details** — loading skeletons, empty states, error banners, keyboard focus rings, reduced-motion support, responsive down to mobile.

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | Angular 17 (standalone, Signals)        |
| State          | NgRx Store + Effects (`createFeature`)  |
| Styling        | Tailwind CSS                            |
| Charts         | Chart.js via ng2-charts                 |
| Icons          | lucide-angular                          |
| Mock API       | json-server                             |
| Language       | TypeScript (strict)                     |

## Getting started

### Prerequisites
- Node.js 18.19+ (or 20+)
- npm 10+

### Install
```bash
npm install
```

### Run (API + app together)
```bash
npm run dev
```
- App: http://localhost:4200
- Mock API: http://localhost:3000

Prefer separate terminals?
```bash
npm run api     # json-server on :3000
npm start       # ng serve on :4200
```

### Demo accounts (password: `nimbus123`)
| Email                      | Role    | Can see Team? | Can delete? |
| -------------------------- | ------- | ------------- | ----------- |
| amara.okafor@nimbus.io     | admin   | Yes           | Yes         |
| daniel.reyes@nimbus.io     | manager | Yes           | No          |
| priya.nair@nimbus.io       | member  | No            | No          |

## Project structure

```
src/app/
├── core/                  # singletons: models, services, interceptors, guards
│   ├── models/            # typed domain (User, Role, DashboardMetrics)
│   ├── services/          # AuthService (signals), UsersService, MetricsService
│   ├── interceptors/      # authInterceptor, errorInterceptor
│   └── guards/            # authGuard, roleGuard(role)
├── store/users/           # NgRx feature: actions, reducer, selectors, effects
├── features/              # lazy-loaded route components
│   ├── auth/login
│   ├── dashboard/
│   ├── users/             # users-list (table) + user-form (modal)
│   └── forbidden
├── shared/
│   ├── layout/            # shell, sidebar, topbar
│   ├── ui/                # stat-card
│   └── directives/        # has-role structural directive
├── app.config.ts          # providers (router, http, store, charts, icons)
└── app.routes.ts          # route map + guards + lazy loading
```

## Build & deploy

```bash
npm run build              # outputs to dist/nimbus-admin-dashboard
```

For a public **demo link**, deploy the built app to a static host and point `environment.prod.ts` `apiUrl` at a hosted API:
1. Push this repo to GitHub.
2. Import it on **Vercel** or **Netlify** (build command `npm run build`, output dir `dist/nimbus-admin-dashboard/browser`).
3. Host the mock API on **Render** (`json-server db.json`) or swap in your real backend, then set `apiUrl` accordingly.

## License
MIT — use it freely in your portfolio.
