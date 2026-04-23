import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, UserLoginRequest, UserRegisterRequest } from '../models/models';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'checkuin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;
  isLoggedIn = signal(this.hasValidToken());

  constructor(private http: HttpClient, private router: Router) {}

  register(data: UserRegisterRequest) {
    return this.http.post<string>(`${this.api}/auth/register`, data, { responseType: 'text' as 'json' });
  }

  login(data: UserLoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
