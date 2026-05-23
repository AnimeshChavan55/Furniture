import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { Toast } from '../../../core/models';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" [@slideIn]>
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <i class="fas fa-check-circle"></i> }
              @case ('error') { <i class="fas fa-times-circle"></i> }
              @case ('warning') { <i class="fas fa-exclamation-triangle"></i> }
              @default { <i class="fas fa-info-circle"></i> }
            }
          </div>
          <div class="toast-content">
            @if (toast.title) { <strong class="toast-title">{{ toast.title }}</strong> }
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 90px; right: 20px; z-index: 1100; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .toast { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 12px; background: white; box-shadow: 0 8px 32px rgba(0,0,0,0.16); border: 1px solid rgba(0,0,0,0.06); pointer-events: all; animation: toastIn 0.3s ease; min-width: 280px; max-width: 380px; }
    .toast-success { border-left: 4px solid #2D8A5A; }
    .toast-error { border-left: 4px solid #C0392B; }
    .toast-warning { border-left: 4px solid #D4860A; }
    .toast-info { border-left: 4px solid #2563EB; }
    .toast-icon { font-size: 1.125rem; margin-top: 1px; flex-shrink: 0; }
    .toast-success .toast-icon { color: #2D8A5A; }
    .toast-error .toast-icon { color: #C0392B; }
    .toast-warning .toast-icon { color: #D4860A; }
    .toast-info .toast-icon { color: #2563EB; }
    .toast-content { flex: 1; }
    .toast-title { display: block; font-size: 0.875rem; font-weight: 700; color: #1A1208; margin-bottom: 2px; }
    .toast-message { font-size: 0.8125rem; color: #5C4033; }
    .toast-close { background: none; border: none; cursor: pointer; color: #9E8575; padding: 2px; font-size: 0.875rem; line-height: 1; flex-shrink: 0; }
    .toast-close:hover { color: #1A1208; }
    @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
