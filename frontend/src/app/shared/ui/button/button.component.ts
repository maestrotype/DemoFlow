import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.types';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<ButtonVariant>('secondary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);

  variantClass = computed(() => {
    return `btn-${this.variant()} btn-${this.size()}`;
  });
}
