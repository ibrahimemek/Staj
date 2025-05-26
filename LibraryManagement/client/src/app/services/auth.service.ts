import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5010/api';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('userRole'));
  public token$ = this.tokenSubject.asObservable();
  public role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login Response:', response);
          console.log('User Role:', response.role);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
          this.tokenSubject.next(response.token);
          this.roleSubject.next(response.role);
        })
      );
  }

  register(userData: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getRole(): string | null {
    const role = this.roleSubject.value;
    console.log('Current Role:', role);
    return role;
  }

  isAdmin(): boolean {
    const isAdmin = this.roleSubject.value === 'Admin';
    console.log('isAdmin check:', { role: this.roleSubject.value, isAdmin });
    return isAdmin;
  }

  isUser(): boolean {
    const isUser = this.roleSubject.value === 'User';
    console.log('isUser check:', { role: this.roleSubject.value, isUser });
    return isUser;
  }

  hasEditPermission(): boolean {
    const role = this.roleSubject.value;
    const hasPermission = role === 'User' || role === 'Admin';
    console.log('hasEditPermission check:', { role, hasPermission });
    return hasPermission;
  }
} 