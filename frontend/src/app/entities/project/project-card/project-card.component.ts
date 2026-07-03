import { Component, input } from '@angular/core';
import { Project } from '@entities/project/model';
import { BadgeComponent } from '@shared/ui/badge';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
  imports: [BadgeComponent, DurationPipe, CommonModule]
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
}