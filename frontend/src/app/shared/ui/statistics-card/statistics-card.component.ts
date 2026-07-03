import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export interface StatisticCard {
  title: string;
  value: string | number;
  icon?: string;
}

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  templateUrl: './statistics-card.html',
  styleUrl: './statistics-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsCardComponent {
  statistic = input.required<StatisticCard>();
}