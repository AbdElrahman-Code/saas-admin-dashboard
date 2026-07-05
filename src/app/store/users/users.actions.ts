import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserDraft } from '@core/models';

/**
 * Action groups keep names consistent and self-documenting.
 * Each async flow follows the request / success / failure triad.
 */
export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Create User': props<{ draft: UserDraft }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),

    'Update User': props<{ id: string; changes: Partial<UserDraft> }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    'Set Search Term': props<{ term: string }>(),
    'Set Role Filter': props<{ role: 'all' | 'admin' | 'manager' | 'member' }>()
  }
});
