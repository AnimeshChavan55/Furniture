import { Component } from '@angular/core';
@Component({
  selector: 'app-admin-reports',
  standalone: true,
  template: `
    <div>
      <h1 style="margin-bottom:24px">Sales Reports</h1>
      <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
        <p>Revenue charts, top products, and exportable data.</p>
      </div>
    </div>
  `
})
export class AdminReportsComponent {}
