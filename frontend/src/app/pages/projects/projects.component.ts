import { Component } from '@angular/core';
import { RecentProjectsComponent } from '../../widgets/recent-projects';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RecentProjectsComponent],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class ProjectsPageComponent {}

