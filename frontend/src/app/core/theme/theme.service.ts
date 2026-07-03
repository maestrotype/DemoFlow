import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Theme modes
type ThemeMode = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // User-selected theme (can be 'dark', 'light', or 'system')
  currentTheme = signal<ThemeMode>('system');

  // Private signal to track system color scheme preference reactively
  private systemPrefersDark = signal<boolean>(false);

  // Computed resolved theme (actual theme applied)
  resolvedTheme = computed<'dark' | 'light'>(() => {
    const current = this.currentTheme();
    if (current === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return current as 'dark' | 'light';
  });

  // Theme tokens as signals for reactive updates
  private readonly themeTokens = {
    dark: {
      '--color-bg-base': 'hsl(225 14% 5.5%)',
      '--color-bg-elevated': 'hsl(225 12% 8%)',
      '--color-bg-surface': 'hsl(225 11% 11%)',
      '--color-bg-overlay': 'hsl(225 10% 15%)',
      '--color-bg-subtle': 'hsl(225 10% 13%)',
      '--color-bg-glass': 'hsl(225 14% 18% / 55%)',
      '--color-border': 'hsl(225 10% 20%)',
      '--color-border-subtle': 'hsl(225 10% 14%)',
      '--color-border-focus': 'hsl(255 80% 72% / 60%)',
      '--color-border-glass': 'hsl(0 0% 100% / 8%)',
      '--color-border-error': 'hsl(3 85% 62% / 60%)',
      '--color-accent': 'hsl(255 80% 65%)',
      '--color-accent-hover': 'hsl(255 80% 72%)',
      '--color-accent-active': 'hsl(255 80% 58%)',
      '--color-accent-subtle': 'hsl(255 80% 65% / 12%)',
      '--color-success': 'hsl(145 65% 52%)',
      '--color-success-subtle': 'hsl(145 65% 52% / 12%)',
      '--color-warning': 'hsl(38 90% 58%)',
      '--color-warning-subtle': 'hsl(38 90% 58% / 12%)',
      '--color-error': 'hsl(3 85% 62%)',
      '--color-error-subtle': 'hsl(3 85% 62% / 12%)',
      '--color-info': 'hsl(200 80% 60%)',
      '--color-info-subtle': 'hsl(200 80% 60% / 12%)',
      '--color-text-primary': 'hsl(225 10% 95%)',
      '--color-text-secondary': 'hsl(225 10% 65%)',
      '--color-text-muted': 'hsl(225 10% 42%)',
      '--color-text-placeholder': 'hsl(225 10% 35%)',
      '--color-text-disabled': 'hsl(225 10% 28%)',
    },
    light: {
      '--color-bg-base': 'hsl(220 20% 97%)',
      '--color-bg-elevated': 'hsl(0 0% 100%)',
      '--color-bg-surface': 'hsl(220 20% 99%)',
      '--color-bg-overlay': 'hsl(220 15% 95%)',
      '--color-bg-subtle': 'hsl(220 20% 96%)',
      '--color-bg-glass': 'hsl(0 0% 100% / 70%)',
      '--color-border': 'hsl(220 15% 88%)',
      '--color-border-subtle': 'hsl(220 15% 93%)',
      '--color-border-focus': 'hsl(255 80% 55% / 50%)',
      '--color-border-glass': 'hsl(0 0% 0% / 8%)',
      '--color-border-error': 'hsl(3 85% 50% / 50%)',
      '--color-accent': 'hsl(255 80% 55%)',
      '--color-accent-hover': 'hsl(255 80% 48%)',
      '--color-accent-active': 'hsl(255 80% 62%)',
      '--color-accent-subtle': 'hsl(255 80% 55% / 10%)',
      '--color-success': 'hsl(145 65% 38%)',
      '--color-success-subtle': 'hsl(145 65% 38% / 10%)',
      '--color-warning': 'hsl(38 90% 42%)',
      '--color-warning-subtle': 'hsl(38 90% 42% / 10%)',
      '--color-error': 'hsl(3 85% 48%)',
      '--color-error-subtle': 'hsl(3 85% 48% / 10%)',
      '--color-info': 'hsl(200 80% 40%)',
      '--color-info-subtle': 'hsl(200 80% 40% / 10%)',
      '--color-text-primary': 'hsl(225 25% 12%)',
      '--color-text-secondary': 'hsl(225 15% 38%)',
      '--color-text-muted': 'hsl(225 12% 58%)',
      '--color-text-placeholder': 'hsl(225 12% 65%)',
      '--color-text-disabled': 'hsl(225 12% 72%)',
    }
  };

  // Apply theme tokens to document root
  private applyTheme(theme: 'dark' | 'light') {
    const tokens = this.themeTokens[theme];
    Object.entries(tokens).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  // Apply data-theme attribute for CSS selectors
  private applyThemeAttribute(theme: 'dark' | 'light') {
    document.documentElement.dataset['theme'] = theme;
  }

  // Toggle between dark and light themes
  toggleTheme() {
    const next = this.resolvedTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  // Set theme explicitly (dark/light/system)
  setTheme(theme: ThemeMode) {
    this.currentTheme.set(theme);

    // Save preference to localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }

    // Apply resolved theme (dark/light)
    const resolved = this.resolvedTheme();
    this.applyTheme(resolved);
    this.applyThemeAttribute(resolved);
  }

  // Initialize theme on app load
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Only run in browser
    if (!isPlatformBrowser(this.platformId)) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark.set(mediaQuery.matches);

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    // Listen for system theme changes when in 'system' mode
    mediaQuery.addEventListener('change', (e) => {
      this.systemPrefersDark.set(e.matches);
      if (this.currentTheme() === 'system') {
        const resolved = this.resolvedTheme();
        this.applyTheme(resolved);
        this.applyThemeAttribute(resolved);
      }
    });
  }

  // Get current theme tokens
  getThemeTokens() {
    return this.themeTokens[this.resolvedTheme()];
  }

  // Check if reduced motion is preferred
  get prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
