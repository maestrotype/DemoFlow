import { Component } from '@angular/core';
import { RecentProjectsComponent } from '../../widgets/recent-projects';
import { ButtonComponent } from '../../shared/ui/button';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RecentProjectsComponent, ButtonComponent],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class ProjectsPageComponent {}

