import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User, UserDraft } from '../models';

/**
 * UsersService
 * Thin, typed wrapper over the REST endpoints exposed by json-server.
 * Components never touch HttpClient directly — they go through NgRx effects,
 * which call this service. That keeps side-effects in one predictable place.
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  create(draft: UserDraft): Observable<User> {
    // Server-derived fields are stamped here so the store stays the source of truth.
    const payload = { ...draft, lastActive: new Date().toISOString() };
    return this.http.post<User>(this.base, payload);
  }

  update(id: string, changes: Partial<UserDraft>): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}`, changes);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
