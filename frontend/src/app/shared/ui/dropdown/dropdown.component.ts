import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { DropdownItem } from './dropdown.types';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {
  items = input<DropdownItem[]>([]);
  itemSelected = output<DropdownItem>();

  isOpen = signal<boolean>(false);

  toggleDropdown() {
    this.isOpen.update(open => !open);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  onItemClick(item: DropdownItem) {
    if (item.disabled) return;
    this.itemSelected.emit(item);
    this.closeDropdown();
  }
}
