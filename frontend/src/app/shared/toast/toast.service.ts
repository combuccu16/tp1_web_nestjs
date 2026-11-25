import { Service, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'danger';
}

@Service()
export class ToastService {
  private readonly toastsState = signal<Toast[]>([]);
  private nextId = 1;

  readonly toasts = this.toastsState.asReadonly();

  show(message: string, type: Toast['type']): void {
    const id = this.nextId++;
    this.toastsState.update((toasts) => [...toasts, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number): void {
    this.toastsState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
