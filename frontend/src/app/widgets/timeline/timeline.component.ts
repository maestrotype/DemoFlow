import { Component, signal } from '@angular/core';
import { Scene } from '../../entities/scene/scene.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  // Empty mock scenes list for skeleton
  scenes = signal<Scene[]>([]);
}
