import { Component } from '@angular/core';
@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  template: `
    <div>
      <h1 style="margin-bottom:24px">Inventory Management</h1>
      <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
        <p>Real-time stock levels and low-stock alerts.</p>
      </div>
    </div>
  `
})
export class AdminInventoryComponent {}
