import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Project } from '@entities/project';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [],
  templateUrl: './recent-projects.html',
  styleUrl: './recent-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentProjectsComponent {
  readonly projects = signal<Project[]>([]);
}
