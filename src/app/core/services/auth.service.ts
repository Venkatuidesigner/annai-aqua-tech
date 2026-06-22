import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = APP_CONSTANTS.LOCAL_STORAGE_KEYS.AUTH;

  isLoggedIn = signal<boolean>(this.checkStoredAuth());

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (
      username === APP_CONSTANTS.ADMIN_USERNAME &&
      password === APP_CONSTANTS.ADMIN_PASSWORD
    ) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  private checkStoredAuth(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }
}
