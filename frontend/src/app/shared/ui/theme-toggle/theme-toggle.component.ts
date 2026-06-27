import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      class="theme-toggle"
      [class.theme-toggle--dark]="themeService.resolvedTheme() === 'dark'"
      (click)="themeService.toggleTheme()"
      aria-label="Toggle theme"
    >
      <svg
        class="theme-toggle__icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          class="theme-toggle__icon--sun"
          cx="12"
          cy="12"
          r="5"
          *ngIf="themeService.resolvedTheme() === 'light'"
        />
        <path
          class="theme-toggle__icon--moon"
          d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
          *ngIf="themeService.resolvedTheme() === 'dark'"
        />
      </svg>
    </button>
  `,
  styles: [
    `
      .theme-toggle {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: var(--color-bg-subtle);
        }

        &__icon {
          width: 20px;
          height: 20px;
          color: var(--color-text-primary);

          &--sun {
            animation: rotate 0.5s ease;
          }

          &--moon {
            animation: glow 1s ease infinite alternate;
          }
        }
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes glow {
        from {
          opacity: 0.7;
        }
        to {
          opacity: 1;
          filter: drop-shadow(0 0 4px var(--color-accent));
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
