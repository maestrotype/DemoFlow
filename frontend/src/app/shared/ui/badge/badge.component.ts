import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BadgeVariant } from './badge.types';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');

  badgeClass = computed(() => {
    return `badge badge-${this.variant()}`;
  });
}
