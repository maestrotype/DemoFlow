import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { AvatarSize } from './avatar.types';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  src = input<string | null>(null);
  name = input<string>('');
  size = input<AvatarSize>('md');

  imageError = signal<boolean>(false);

  avatarClass = computed(() => {
    return `avatar-container avatar-${this.size()}`;
  });

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (this.name()[0] || '?').toUpperCase();
  });

  fallbackBgColor = computed(() => {
    const nameStr = this.name();
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 60%, 40%)`;
  });

  onImageError() {
    this.imageError.set(true);
  }
}
