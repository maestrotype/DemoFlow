import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@widgets/sidebar';
import { TopbarComponent } from '@widgets/topbar';

@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './workspace-layout.html',
  styleUrl: './workspace-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceLayoutComponent {}
