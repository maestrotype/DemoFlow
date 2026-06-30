import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Project } from '@entities/project';
import { ProjectCardComponent } from '@entities/project/project-card';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './recent-projects.html',
  styleUrl: './recent-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentProjectsComponent {
  readonly projects = signal<Project[]>([
    {
      id: '1',
      title: 'Project Alpha',
      thumbnailUrl: '',
      sceneCount: 5,
      durationMs: 120000,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      title: 'Project Beta',
      thumbnailUrl: '',
      sceneCount: 3,
      durationMs: 90000,
      createdAt: '2024-02-10',
      updatedAt: '2024-02-15'
    },
    {
      id: '3',
      title: 'Project Gamma',
      thumbnailUrl: '',
      sceneCount: 8,
      durationMs: 180000,
      createdAt: '2024-03-05',
      updatedAt: '2024-03-10'
    },
    {
      id: '4',
      title: 'Project Delta',
      thumbnailUrl: '',
      sceneCount: 2,
      durationMs: 60000,
      createdAt: '2024-03-20',
      updatedAt: '2024-03-25'
    },
    {
      id: '5',
      title: 'Project Epsilon',
      thumbnailUrl: '',
      sceneCount: 12,
      durationMs: 300000,
      createdAt: '2024-04-01',
      updatedAt: '2024-04-05'
    },
    {
      id: '6',
      title: 'Project Zeta',
      thumbnailUrl: '',
      sceneCount: 7,
      durationMs: 150000,
      createdAt: '2024-04-15',
      updatedAt: '2024-04-20'
    }
  ]);
}
