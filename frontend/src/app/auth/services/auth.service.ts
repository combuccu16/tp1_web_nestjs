import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export const TOKEN_STORAGE_KEY = 'token';

export interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  ttl: number;
  created: string;
  userId: number;
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenState = signal<string | null>(readStoredToken());

  readonly token = this.tokenState.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenState() !== null);

  login(credentials: Credentials): Observable<void> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.login, credentials).pipe(
      tap((response) => this.saveToken(response.id)),
      map(() => undefined),
    );
  }

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // storage unavailable: the in-memory state is still cleared below
    }
    this.tokenState.set(null);
  }

  private saveToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // storage unavailable: the user stays logged in for this tab only
    }
    this.tokenState.set(token);
  }
}
