/** Roles are ordered by privilege; used by the RBAC guard/directive. */
export type Role = 'admin' | 'manager' | 'member';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: UserStatus;
  lastActive: string; // ISO 8601
  avatarColor: string;
}

/** Payload shape for create/update — server assigns `id` & `lastActive`. */
export type UserDraft = Omit<User, 'id' | 'lastActive'>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface DashboardMetrics {
  mrr: number;
  mrrChangePct: number;
  activeUsers: number;
  activeUsersChangePct: number;
  churnPct: number;
  churnChangePct: number;
  openTickets: number;
  openTicketsChangePct: number;
  revenueSeries: { month: string; value: number }[];
  signupsByPlan: { plan: string; value: number }[];
}
