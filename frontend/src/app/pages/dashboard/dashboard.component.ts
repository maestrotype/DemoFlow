import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RecentProjectsComponent } from '@widgets/recent-projects';
import { StatisticsCardComponent } from '@shared/ui/statistics-card';
import { MOCK_STATISTICS } from '@entities/project/mocks/statistics.mock';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RecentProjectsComponent, StatisticsCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  statistics = MOCK_STATISTICS;
  
  statisticCards = [
    { title: 'Total Projects', value: this.statistics.totalProjects },
    { title: 'Videos', value: this.statistics.videos },
    { title: 'Exports', value: this.statistics.exports },
    { title: 'Storage Used', value: this.statistics.storageUsed }
  ];
}
