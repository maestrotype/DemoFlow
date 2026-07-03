import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SkeletonVariant } from './skeleton.types';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('rect');
  width = input<string>('100%');
  height = input<string>('100%');

  skeletonClass = computed(() => {
    return `skeleton skeleton-${this.variant()}`;
  });
}
