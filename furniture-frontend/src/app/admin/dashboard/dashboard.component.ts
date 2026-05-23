import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 style="margin-bottom:24px">Dashboard Overview</h1>
      @if (loading()) { <p>Loading...</p> } @else {
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-bottom:32px">
          <div class="stat-card">
            <div class="stat-icon" style="background:#E3F2FD;color:#1976D2"><i class="fas fa-users"></i></div>
            <div class="stat-info"><span>Total Users</span><strong>{{ stats().total_users | number }}</strong></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#E8F5E9;color:#388E3C"><i class="fas fa-box"></i></div>
            <div class="stat-info"><span>Total Orders</span><strong>{{ stats().total_orders | number }}</strong></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#FFF3E0;color:#F57C00"><i class="fas fa-clock"></i></div>
            <div class="stat-info"><span>Pending Orders</span><strong>{{ stats().pending_orders | number }}</strong></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#F3E5F5;color:#7B1FA2"><i class="fas fa-rupee-sign"></i></div>
            <div class="stat-info"><span>Total Revenue</span><strong>₹{{ stats().total_revenue | number }}</strong></div>
          </div>
        </div>
        <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
          <h3 style="margin-bottom:16px">Recent Orders</h3>
          <table style="width:100%;border-collapse:collapse;text-align:left">
            <thead><tr style="border-bottom:2px solid var(--border-color);color:var(--text-muted)">
              <th style="padding:12px">Order ID</th><th style="padding:12px">Customer</th><th style="padding:12px">Amount</th><th style="padding:12px">Status</th>
            </tr></thead>
            <tbody>
              @for (o of recentOrders; track o.order_number) {
                <tr style="border-bottom:1px solid var(--border-color)">
                  <td style="padding:12px">#{{ o.order_number }}</td>
                  <td style="padding:12px">{{ o.first_name }} {{ o.last_name }}</td>
                  <td style="padding:12px">₹{{ o.total_amount | number }}</td>
                  <td style="padding:12px"><span style="background:#FFF3E0;color:#F57C00;padding:4px 8px;border-radius:12px;font-size:0.8rem">{{ o.status }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .stat-card { background: var(--bg-card); padding: 24px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-card); border: 1px solid var(--border-color); }
    .stat-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .stat-info span { display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 4px; }
    .stat-info strong { font-size: 1.5rem; color: var(--text-primary); }
  `]
})
export class DashboardComponent implements OnInit {
  stats = signal<any>({});
  loading = signal(true);
  recentOrders = [
    { order_number: 'CC-ABC123-XYZ', first_name: 'Rahul', last_name: 'Sharma', total_amount: 47199, status: 'pending' },
    { order_number: 'CC-DEF456-UVW', first_name: 'Priya', last_name: 'Patel', total_amount: 57819, status: 'processing' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe({
      next: res => { if (res.success) { this.stats.set(res.data?.stats || this.getDemoStats()); this.loading.set(false); } },
      error: () => { this.stats.set(this.getDemoStats()); this.loading.set(false); }
    });
  }
  getDemoStats() { return { total_users: 1420, total_orders: 845, pending_orders: 12, total_revenue: 4500000 }; }
}
