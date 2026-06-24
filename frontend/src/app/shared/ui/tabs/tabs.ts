import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TabItem } from './tabs.types';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  items = input<TabItem[]>([]);
  activeId = input<string>('');

  tabChanged = output<string>();

  selectTab(tab: TabItem) {
    if (tab.disabled || tab.id === this.activeId()) return;
    this.tabChanged.emit(tab.id);
  }
}
