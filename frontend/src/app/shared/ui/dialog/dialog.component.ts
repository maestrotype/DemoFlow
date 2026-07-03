import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DialogSize } from './dialog.types';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  size = input<DialogSize>('md');
  closeOnBackdrop = input<boolean>(true);

  close = output<void>();

  dialogClass = computed(() => {
    return `dialog-panel dialog-${this.size()}`;
  });

  closeDialog() {
    this.close.emit();
  }

  onBackdropClick() {
    if (this.closeOnBackdrop()) {
      this.closeDialog();
    }
  }
}
