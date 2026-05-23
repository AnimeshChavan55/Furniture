import { Injectable, signal } from '@angular/core';
import { Toast } from '../models';
const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', title?: string, duration = 4000) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, type, message, title, duration };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.remove(id), duration);
    return id;
  }

  success(message: string, title = 'Success') { return this.show(message, 'success', title); }
  error(message: string, title = 'Error') { return this.show(message, 'error', title); }
  warning(message: string, title = 'Warning') { return this.show(message, 'warning', title); }
  info(message: string, title = 'Info') { return this.show(message, 'info', title); }

  remove(id: string) { this.toasts.update(t => t.filter(toast => toast.id !== id)); }
}
