import { Component, signal } from '@angular/core';
import { Scene } from '../../entities/scene/scene.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <div class="timeline">
      <div class="controls">
        <button class="play-btn">▶ Play</button>
      </div>
      <div class="scenes-strip">
        @for (scene of scenes(); track scene.id) {
          <div class="scene-item">
            <span class="index">{{ scene.orderIndex + 1 }}</span>
            <span class="title">{{ scene.title }}</span>
            <span class="duration">{{ scene.durationMs / 1000 }}s</span>
          </div>
        }
        <button class="add-scene-btn">+ Add Scene</button>
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      height: 120px;
      background: var(--color-bg-elevated, #10111c);
      border-top: 1px solid var(--color-border, #20222f);
      display: flex;
      padding: var(--space-3, 12px);
      gap: var(--space-4, 16px);
      overflow-x: auto;
    }
    .controls {
      display: flex;
      align-items: center;
    }
    .play-btn {
      padding: var(--space-2, 8px) var(--space-4, 16px);
      background: var(--color-bg-surface, #16182a);
      border: 1px solid var(--color-border, #20222f);
      color: var(--color-text-primary, #f0f0f7);
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
    }
    .scenes-strip {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
    }
    .scene-item {
      width: 140px;
      height: 80px;
      background: var(--color-bg-surface, #16182a);
      border: 1px solid var(--color-border, #20222f);
      border-radius: var(--radius-sm, 6px);
      padding: var(--space-2, 8px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
    }
    .add-scene-btn {
      width: 100px;
      height: 80px;
      border: 1px dashed var(--color-border, #20222f);
      background: transparent;
      color: var(--color-text-muted, #5c6480);
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
    }
  `]
})
export class TimelineComponent {
  // Empty mock scenes list for skeleton
  scenes = signal<Scene[]>([]);
}
