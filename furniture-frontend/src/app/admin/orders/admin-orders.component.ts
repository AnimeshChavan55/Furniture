import { Component } from '@angular/core';
@Component({
  selector: 'app-admin-orders',
  standalone: true,
  template: `
    <div>
      <h1 style="margin-bottom:24px">Order Management</h1>
      <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
        <p>Order list and status update functionality goes here.</p>
      </div>
    </div>
  `
})
export class AdminOrdersComponent {}
