import { inject, Injectable, Service, signal } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface TmsUser {
    email : string;
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

@Injectable({ providedIn: 'root'})
export class AuthService {
     
    private http = inject(HttpClient);
    private accessToken = signal<string | null>(null);
    currentUser = signal<TmsUser | null>(null);

    getAccessToken(): string | null {
        return this.accessToken();
    }

    hasRole(role: string): boolean {
        const user = this.currentUser();
        return user?.role === role || user?.role == 'Admin';
    }
    async login(credintials: LoginRequest): Promise<void>
    {
      const res = await firstValueFrom(
         this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credintials)
        );

        this.accessToken.set(res.accessToken);

       const payload = JSON.parse(atob(res.accessToken.split(".")[1]));
       const fullName = [payload.FirstName, payload.LastName]
        .filter((part) => !!part)
        .join(' ');
       this.currentUser.set({
        email: payload[EMAIL_CLAIM] || payload.email || payload.sub,
        displayName: fullName || payload.name || payload.email || 'User',
        role: payload[ROLE_CLAIM] ||
         payload.role || 'Student'
       });
       
    }

    logout(): void {
        this.accessToken.set(null);
        this.currentUser.set(null);
    } 

}
