import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '@core/models';
import { UsersActions } from './users.actions';

export interface UsersState {
  entities: User[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  searchTerm: string;
  roleFilter: 'all' | 'admin' | 'manager' | 'member';
}

const initialState: UsersState = {
  entities: [],
  loading: false,
  saving: false,
  error: null,
  searchTerm: '',
  roleFilter: 'all'
};

/**
 * createFeature bundles the reducer + auto-generated feature selectors,
 * eliminating most hand-written selector boilerplate (NgRx 17 pattern).
 */
export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,

    on(UsersActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
    on(UsersActions.loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, entities: users })),
    on(UsersActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(UsersActions.createUser, UsersActions.updateUser, UsersActions.deleteUser,
      (state) => ({ ...state, saving: true, error: null })),

    on(UsersActions.createUserSuccess, (state, { user }) => ({
      ...state, saving: false, entities: [user, ...state.entities]
    })),
    on(UsersActions.updateUserSuccess, (state, { user }) => ({
      ...state, saving: false,
      entities: state.entities.map((u) => (u.id === user.id ? user : u))
    })),
    on(UsersActions.deleteUserSuccess, (state, { id }) => ({
      ...state, saving: false, entities: state.entities.filter((u) => u.id !== id)
    })),

    on(UsersActions.createUserFailure, UsersActions.updateUserFailure, UsersActions.deleteUserFailure,
      (state, { error }) => ({ ...state, saving: false, error })),

    on(UsersActions.setSearchTerm, (state, { term }) => ({ ...state, searchTerm: term })),
    on(UsersActions.setRoleFilter, (state, { role }) => ({ ...state, roleFilter: role }))
  )
});
