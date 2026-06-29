import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  closeOnBackdrop = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg' | 'full'>('md');

  close = output<void>();

  modalClass = computed(() => {
    return `modal-panel modal-${this.size()}`;
  });

  closeModal() {
    this.close.emit();
  }

  onBackdropClick() {
    if (this.closeOnBackdrop()) {
      this.closeModal();
    }
  }
}
