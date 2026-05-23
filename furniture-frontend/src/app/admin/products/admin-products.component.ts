import { Component } from '@angular/core';
@Component({
  selector: 'app-admin-products',
  standalone: true,
  template: `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <h1>Product Management</h1>
        <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Product</button>
      </div>
      <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
        <p>Product list table goes here. Integration with API needed.</p>
      </div>
    </div>
  `
})
export class AdminProductsComponent {}
