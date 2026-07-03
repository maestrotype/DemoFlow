import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Project } from '@entities/project';
import { ProjectCardComponent } from '@entities/project/project-card';
import { MOCK_PROJECTS } from '@entities/project/mocks/projects.mock';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './recent-projects.html',
  styleUrl: './recent-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentProjectsComponent {
  readonly projects = signal<Project[]>(MOCK_PROJECTS);
}
