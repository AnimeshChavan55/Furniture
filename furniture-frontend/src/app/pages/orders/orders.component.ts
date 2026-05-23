import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div style="padding-top:80px;background:var(--bg-secondary);min-height:100vh">
      <div class="container" style="padding-top:32px;padding-bottom:64px">
        <h1 style="margin-bottom:28px"><i class="fas fa-box" style="color:var(--primary)"></i> My Orders</h1>
        @if (loading()) {
          <div style="display:flex;align-items:center;justify-content:center;height:40vh">
            <i class="fas fa-spinner fa-spin fa-2x" style="color:var(--primary)"></i>
          </div>
        } @else if (orders().length === 0) {
          <div class="empty-state">
            <div class="icon">📦</div>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders. Start shopping to find your perfect furniture!</p>
            <a routerLink="/products" class="btn btn-primary btn-lg"><i class="fas fa-store"></i> Shop Now</a>
          </div>
        } @else {
          <div style="display:flex;flex-direction:column;gap:16px">
            @for (order of orders(); track order.id) {
              <div class="order-card" routerLink="/orders/{{ order.id }}">
                <div class="order-header">
                  <div>
                    <span class="order-num">#{{ order.order_number }}</span>
                    <span class="order-date">{{ order.created_at | date:'mediumDate' }}</span>
                  </div>
                  <div class="order-status status-{{ order.status }}">{{ order.status | titlecase }}</div>
                </div>
                <div class="order-body">
                  <div class="order-meta">
                    <span><i class="fas fa-box"></i> {{ order.item_count }} item(s)</span>
                    <span><i class="fas fa-calendar"></i> Est. {{ order.estimated_delivery | date:'mediumDate' }}</span>
                  </div>
                  <div class="order-amount">₹{{ order.total_amount | number }}</div>
                </div>
                <div class="order-footer">
                  <div class="payment-badge" [class.paid]="order.payment_status === 'paid'">
                    <i class="fas" [class.fa-check-circle]="order.payment_status === 'paid'" [class.fa-clock]="order.payment_status !== 'paid'"></i>
                    {{ order.payment_status | titlecase }}
                  </div>
                  <a class="btn btn-ghost btn-sm">View Details <i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .order-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 20px 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-card); cursor: pointer; transition: all var(--transition-base); }
    .order-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); border-color: var(--primary); }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); }
    .order-num { font-weight: 700; color: var(--primary); font-size: 1rem; margin-right: 12px; }
    .order-date { font-size: 0.875rem; color: var(--text-muted); }
    .order-status { padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 600; }
    .order-body { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .order-meta { display: flex; gap: 20px; font-size: 0.875rem; color: var(--text-muted); }
    .order-meta i { color: var(--primary); margin-right: 4px; }
    .order-amount { font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); }
    .order-footer { display: flex; justify-content: space-between; align-items: center; }
    .payment-badge { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
    .payment-badge.paid { color: var(--success); }
  `]
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getUserOrders().subscribe({
      next: res => { if (res.success && res.data) this.orders.set(res.data); this.loading.set(false); },
      error: () => { this.orders.set(this.getDemoOrders()); this.loading.set(false); }
    });
  }

  getDemoOrders(): Order[] {
    return [
      { id: 1, order_number: 'CC-ABC123-XYZ', status: 'manufacturing', subtotal: 39999, tax_amount: 7200, shipping_amount: 0, discount_amount: 0, total_amount: 47199, payment_method: 'online', payment_status: 'paid', shipping_address: {} as any, estimated_delivery: '2024-11-15', created_at: '2024-10-25', item_count: 2 },
      { id: 2, order_number: 'CC-DEF456-UVW', status: 'delivered', subtotal: 48999, tax_amount: 8820, shipping_amount: 0, discount_amount: 0, total_amount: 57819, payment_method: 'online', payment_status: 'paid', shipping_address: {} as any, estimated_delivery: '2024-10-01', created_at: '2024-09-10', item_count: 1 },
    ];
  }
}
