import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div style="display:flex;min-height:100vh;background:var(--bg-secondary);padding-top:80px">
      <!-- Sidebar -->
      <aside style="width:260px;background:var(--bg-card);border-right:1px solid var(--border-color);position:fixed;top:80px;bottom:0;overflow-y:auto;z-index:100">
        <div style="padding:20px">
          <h3 style="font-size:0.8125rem;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.05em;margin-bottom:12px">Admin Panel</h3>
          <nav style="display:flex;flex-direction:column;gap:4px">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="admin-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a routerLink="/admin/orders" routerLinkActive="active" class="admin-link"><i class="fas fa-box"></i> Orders</a>
            <a routerLink="/admin/products" routerLinkActive="active" class="admin-link"><i class="fas fa-couch"></i> Products</a>
            <a routerLink="/admin/inventory" routerLinkActive="active" class="admin-link"><i class="fas fa-boxes"></i> Inventory</a>
            <a routerLink="/admin/customers" routerLinkActive="active" class="admin-link"><i class="fas fa-users"></i> Customers</a>
            <a routerLink="/admin/reports" routerLinkActive="active" class="admin-link"><i class="fas fa-chart-bar"></i> Reports</a>
          </nav>
        </div>
      </aside>
      <!-- Main Content -->
      <main style="flex:1;margin-left:260px;padding:32px">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-link { padding: 12px 16px; border-radius: var(--radius-md); color: var(--text-secondary); text-decoration: none; display: flex; align-items: center; gap: 12px; font-weight: 500; transition: all var(--transition-fast); }
    .admin-link i { width: 16px; text-align: center; }
    .admin-link:hover { background: rgba(139,94,60,0.05); color: var(--primary); }
    .admin-link.active { background: rgba(139,94,60,0.1); color: var(--primary); font-weight: 700; border-right: 3px solid var(--primary); border-radius: var(--radius-md) 0 0 var(--radius-md); }
  `]
})
export class AdminLayoutComponent {}
