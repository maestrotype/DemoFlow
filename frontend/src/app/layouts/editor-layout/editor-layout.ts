import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './editor-layout.html',
  styleUrl: './editor-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorLayoutComponent {}
