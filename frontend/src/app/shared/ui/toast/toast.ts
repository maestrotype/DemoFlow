import { Component, ChangeDetectionStrategy, input, output, computed, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastType } from './toast.types';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnInit {
  message = input<string>('');
  type = input<ToastType>('info');
  durationMs = input<number>(3000);

  close = output<void>();

  isVisible = signal<boolean>(true);

  toastClass = computed(() => {
    return `toast toast-${this.type()}`;
  });

  icon = computed(() => {
    switch (this.type()) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  });

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && this.durationMs() > 0) {
      setTimeout(() => {
        this.closeToast();
      }, this.durationMs());
    }
  }

  closeToast() {
    this.isVisible.set(false);
    this.close.emit();
  }
}
