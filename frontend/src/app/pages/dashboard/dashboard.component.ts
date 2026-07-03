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
    { title: 'Total Projects', value: this.statistics.totalProjects, icon: 'fas fa-folder', secondaryText: '+12 this month' },
    { title: 'Videos', value: this.statistics.videos, icon: 'fas fa-video', secondaryText: '+8 this week' },
    { title: 'Exports', value: this.statistics.exports, icon: 'fas fa-download', secondaryText: '+3 today' },
    { title: 'Storage Used', value: this.statistics.storageUsed, icon: 'fas fa-hdd', secondaryText: 'of 10 GB limit' }
  ];
}