import { Component } from '@angular/core';
import { TimelineComponent } from '../../widgets/timeline/timeline';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [TimelineComponent],
  template: `
    <div class="editor-workspace">
      <header class="editor-header">
        <button class="back-btn">Back to Projects</button>
        <span class="project-name">Project Name (Editor)</span>
        <button class="export-btn">Export</button>
      </header>
      
      <div class="editor-main">
        <aside class="sidebar-left">
          <h3>Layers</h3>
          <!-- Layers list panel placeholder -->
        </aside>
        
        <main class="editor-canvas-container">
          <div class="virtual-canvas">
            <p class="canvas-text">16:9 Canvas Rendering Area</p>
          </div>
        </main>
        
        <aside class="sidebar-right">
          <h3>Properties</h3>
          <!-- Context properties panel placeholder -->
        </aside>
      </div>
      
      <app-timeline></app-timeline>
    </div>
  `,
  styles: [`
    .editor-workspace {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: var(--color-bg-base, #0c0d14);
    }
    .editor-header {
      height: 48px;
      background: var(--color-bg-elevated, #10111c);
      border-bottom: 1px solid var(--color-border, #20222f);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-4, 16px);
    }
    .editor-main {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .sidebar-left, .sidebar-right {
      width: 240px;
      background: var(--color-bg-elevated, #10111c);
      padding: var(--space-4, 16px);
      overflow-y: auto;
    }
    .sidebar-left {
      border-right: 1px solid var(--color-border, #20222f);
    }
    .sidebar-right {
      border-left: 1px solid var(--color-border, #20222f);
    }
    .editor-canvas-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-subtle, #191b2b);
      padding: var(--space-6, 24px);
    }
    .virtual-canvas {
      width: 100%;
      max-width: 800px;
      aspect-ratio: 16 / 9;
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg, 0 12px 40px rgba(0,0,0,0.5));
    }
    .back-btn, .export-btn {
      padding: var(--space-1, 4px) var(--space-3, 12px);
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #20222f);
      background: var(--color-bg-surface, #16182a);
      color: var(--color-text-primary, #f0f0f7);
      cursor: pointer;
    }
    .export-btn {
      background: var(--color-accent, #7c5ce7);
      border: none;
      color: white;
    }
  `]
})
export class EditorPageComponent {}
