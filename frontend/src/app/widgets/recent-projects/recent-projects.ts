import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ProjectCardComponent } from '@entities/project';
import { Project } from '@entities/project';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './recent-projects.html',
  styleUrl: './recent-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentProjectsComponent {
  readonly projects = signal<Project[]>([]);
}
