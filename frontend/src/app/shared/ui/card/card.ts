import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CardVariant } from './card.types';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  variant = input<CardVariant>('solid');

  cardClass = computed(() => {
    return `card card-${this.variant()}`;
  });
}
