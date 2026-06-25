import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RecentProjectsComponent } from '@widgets/recent-projects';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RecentProjectsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {}
