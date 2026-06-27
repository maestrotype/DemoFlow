export type DialogSize = 'sm' | 'md' | 'lg' | 'full';
export interface DialogConfig {
  title?: string;
  size?: DialogSize;
  closeOnBackdrop?: boolean;
}
