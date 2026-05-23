import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  // Signals for reactive state
  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('cc_user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  }

  register(data: { first_name: string; last_name: string; email: string; password: string; phone?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => { if (res.success && res.data) this.setSession(res.data); })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => { if (res.success && res.data) this.setSession(res.data); })
    );
  }

  private setSession(data: { token: string; user: User }) {
    localStorage.setItem('cc_token', data.token);
    localStorage.setItem('cc_user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  logout() {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('cc_token');
  }

  updateCurrentUser(user: User) {
    localStorage.setItem('cc_user', JSON.stringify(user));
    this.currentUser.set(user);
  }
}
