import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { TooltipPosition } from './tooltip.types';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  text = input<string>('');
  position = input<TooltipPosition>('top');

  isVisible = signal<boolean>(false);

  tooltipClass = computed(() => {
    return `tooltip-bubble tooltip-${this.position()}`;
  });

  show() {
    if (!this.text()) return;
    this.isVisible.set(true);
  }

  hide() {
    this.isVisible.set(false);
  }
}
