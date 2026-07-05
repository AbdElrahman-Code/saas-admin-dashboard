import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { UsersService } from '@core/services/users.service';
import { UsersActions } from './users.actions';

/**
 * Effects isolate every HTTP side-effect from the reducer.
 * The reducer stays pure; the store stays predictable.
 */
@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(UsersService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.api.getAll().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((e) => of(UsersActions.loadUsersFailure({ error: e.message ?? 'Failed to load users.' })))
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      mergeMap(({ draft }) =>
        this.api.create(draft).pipe(
          map((user) => UsersActions.createUserSuccess({ user })),
          catchError((e) => of(UsersActions.createUserFailure({ error: e.message ?? 'Failed to create user.' })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ id, changes }) =>
        this.api.update(id, changes).pipe(
          map((user) => UsersActions.updateUserSuccess({ user })),
          catchError((e) => of(UsersActions.updateUserFailure({ error: e.message ?? 'Failed to update user.' })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError((e) => of(UsersActions.deleteUserFailure({ error: e.message ?? 'Failed to delete user.' })))
        )
      )
    )
  );
}
