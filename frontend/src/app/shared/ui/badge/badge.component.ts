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
  status = input<string | undefined>(undefined);

  badgeClass = computed(() => {
    // Map status to variant if provided
    let finalVariant: BadgeVariant = this.variant();
    
    const statusValue = this.status();
    if (statusValue) {
      switch (statusValue.toLowerCase()) {
        case 'draft':
          finalVariant = 'default';
          break;
        case 'in-progress':
          finalVariant = 'warning';
          break;
        case 'completed':
          finalVariant = 'success';
          break;
        case 'archived':
          finalVariant = 'info';
          break;
        default:
          finalVariant = this.variant();
      }
    }
    
    return `badge badge-${finalVariant}`;
  });
}
