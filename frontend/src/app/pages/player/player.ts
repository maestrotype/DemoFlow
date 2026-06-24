import { Component } from '@angular/core';

@Component({
  selector: 'app-player-page',
  standalone: true,
  template: `
    <div class="player-page">
      <main class="player-container">
        <div class="demo-player-canvas">
          <p>Interactive Demo Player Area</p>
        </div>
        <footer class="player-footer">
          <div class="brand">Made with DemoFlow</div>
          <button class="action-btn">Sign Up</button>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .player-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #000;
      color: #fff;
    }
    .player-container {
      width: 100%;
      max-width: 960px;
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 16px);
      padding: var(--space-4, 16px);
    }
    .demo-player-canvas {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #333;
      border-radius: var(--radius-md, 10px);
    }
    .player-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--text-sm, 13px);
      color: #888;
    }
    .action-btn {
      padding: var(--space-2, 8px) var(--space-4, 16px);
      background: var(--color-accent, #7c5ce7);
      border: none;
      color: white;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
    }
  `]
})
export class PlayerPageComponent {}
