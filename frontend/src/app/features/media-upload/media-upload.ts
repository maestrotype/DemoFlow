import { Component } from '@angular/core';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  template: `
    <div class="media-upload-zone">
      <p>Drag files here or click to upload</p>
    </div>
  `,
  styles: [`
    .media-upload-zone {
      border: 2px dashed var(--color-border, #20222f);
      padding: var(--space-6, 24px);
      text-align: center;
      border-radius: var(--radius-md, 10px);
      cursor: pointer;
    }
  `]
})
export class MediaUploadComponent {}
