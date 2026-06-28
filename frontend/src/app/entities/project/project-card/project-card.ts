import { Component, input } from '@angular/core';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss']
})
export class ProjectCardComponent {
  project = input.required<Project>();
}

