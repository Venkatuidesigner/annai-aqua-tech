import { Injectable, signal, effect } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = APP_CONSTANTS.LOCAL_STORAGE_KEYS.THEME;

  isDarkMode = signal<boolean>(this.getStoredTheme());

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((v) => !v);
  }

  private getStoredTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
