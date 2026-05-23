import { Component } from '@angular/core';
@Component({
  selector: 'app-admin-customers',
  standalone: true,
  template: `
    <div>
      <h1 style="margin-bottom:24px">Customers</h1>
      <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
        <p>Customer list and user management functionality.</p>
      </div>
    </div>
  `
})
export class AdminCustomersComponent {}
