import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SpinnerSize } from './spinner.types';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  size = input<SpinnerSize>('md');

  spinnerClass = computed(() => {
    return `spinner spinner-${this.size()}`;
  });
}
