import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signals-first theme state management
  currentTheme = signal<'dark' | 'light'>('dark');

  toggleTheme() {
    this.currentTheme.update(theme => theme === 'dark' ? 'light' : 'dark');
  }
}
