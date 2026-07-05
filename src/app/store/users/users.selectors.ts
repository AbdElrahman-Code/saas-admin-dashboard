import { createSelector } from '@ngrx/store';
import { usersFeature } from './users.reducer';

const { selectEntities, selectLoading, selectSaving, selectError, selectSearchTerm, selectRoleFilter } = usersFeature;

export const selectUsersLoading = selectLoading;
export const selectUsersSaving = selectSaving;
export const selectUsersError = selectError;

/** Derived view-model: applies search + role filter in one memoised selector. */
export const selectFilteredUsers = createSelector(
  selectEntities,
  selectSearchTerm,
  selectRoleFilter,
  (users, term, role) => {
    const q = term.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = role === 'all' || u.role === role;
      const matchesTerm =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
      return matchesRole && matchesTerm;
    });
  }
);

/** Small aggregate used by the dashboard header chips. */
export const selectUsersSummary = createSelector(selectEntities, (users) => ({
  total: users.length,
  active: users.filter((u) => u.status === 'active').length,
  invited: users.filter((u) => u.status === 'invited').length,
  suspended: users.filter((u) => u.status === 'suspended').length
}));
