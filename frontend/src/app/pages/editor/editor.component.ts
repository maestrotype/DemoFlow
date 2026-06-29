import { Component } from '@angular/core';
import { TimelineComponent } from '../../widgets/timeline/timeline.component';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorPageComponent {}
