import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TmsUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const REFRESH_KEY = 'tms.refreshToken';

function decodeJwtPayload(token: string): Record<string, any> {
  const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(null);
  private refreshInFlight: Promise<boolean> | null = null;
  currentUser = signal<TmsUser | null>(null);

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(role: string): boolean {
    // Strict match: an Admin does NOT automatically pass Instructor/Student checks.
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentUser()?.role;
    return !!userRole && roles.includes(userRole);
  }

  async login(credentials: LoginRequest): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
    );
    this.applyTokens(res);
  }

  forgotPassword(email: string): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${environment.apiUrl}/auth/forgot-password`, { email })
    );
  }

  resetPassword(email: string, token: string, newPassword: string): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${environment.apiUrl}/auth/reset-password`, { email, token, newPassword })
    );
  }

  refresh(): Promise<boolean> {
    if (this.refreshInFlight) return this.refreshInFlight;

    let refreshToken: string | null = null;
    try { refreshToken = localStorage.getItem(REFRESH_KEY); } catch {}
    if (!refreshToken) return Promise.resolve(false);

    this.refreshInFlight = firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
    )
      .then((res) => { this.applyTokens(res); return true; })
      .catch((err) => {
        // Only a real rejection means the session is dead. A network error or
        // a slow cold start must not log the user out.
        if (err instanceof HttpErrorResponse && (err.status === 400 || err.status === 401)) {
          this.logout();
        }
        return false;
      })
      .finally(() => { this.refreshInFlight = null; });

    return this.refreshInFlight;
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    try { localStorage.removeItem(REFRESH_KEY); } catch {}
  }

  private applyTokens(res: AuthResponse): void {
    this.accessToken.set(res.accessToken);
    try { localStorage.setItem(REFRESH_KEY, res.refreshToken); } catch {}

    const payload = decodeJwtPayload(res.accessToken);
    const fullName = [payload['FirstName'], payload['LastName']].filter((p) => !!p).join(' ');
    this.currentUser.set({
      id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        || payload['nameid'] || payload['sub'] || '',
      email: payload[EMAIL_CLAIM] || payload['email'] || payload['sub'],
      displayName: fullName || payload['name'] || payload['email'] || 'User',
      role: payload[ROLE_CLAIM] || payload['role'] || 'Student',
    });
  }
}