import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div style="padding-top:80px;background:var(--bg-secondary);min-height:100vh">
      @if (loading()) {
        <div style="display:flex;align-items:center;justify-content:center;height:60vh"><i class="fas fa-spinner fa-spin fa-2x" style="color:var(--primary)"></i></div>
      } @else if (order()) {
        <div class="container" style="padding-top:32px;padding-bottom:64px">
          <div class="breadcrumb">
            <a routerLink="/orders">My Orders</a><span class="separator">/</span>
            <span class="current">#{{ order()!.order_number }}</span>
          </div>
          <div class="od-header">
            <div>
              <h1 style="margin-bottom:4px">Order #{{ order()!.order_number }}</h1>
              <p style="color:var(--text-muted)">Placed on {{ order()!.created_at | date:'longDate' }}</p>
            </div>
            <div class="status-badge status-{{ order()!.status }}">{{ order()!.status | titlecase }}</div>
          </div>

          <div class="od-layout">
            <div class="od-main">
              <!-- Tracking Timeline -->
              @if (order()!.tracking && order()!.tracking!.length > 0) {
                <div class="detail-section">
                  <h3><i class="fas fa-map-marker-alt"></i> Order Tracking</h3>
                  <div class="timeline">
                    @for (track of order()!.tracking; track track.id; let last = $last) {
                      <div class="timeline-item" [class.latest]="$first">
                        <div class="tl-dot"></div>
                        @if (!last) { <div class="tl-line"></div> }
                        <div class="tl-content">
                          <strong>{{ track.status }}</strong>
                          <p>{{ track.description }}</p>
                          <span>{{ track.created_at | date:'medium' }}</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Items -->
              <div class="detail-section">
                <h3><i class="fas fa-box"></i> Ordered Items</h3>
                @for (item of order()!.items; track item.id) {
                  <div class="item-row">
                    <img [src]="item.thumbnail || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=60'" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
                    <div style="flex:1">
                      <strong>{{ item.product_name }}</strong><br>
                      <span style="font-size:0.8125rem;color:var(--text-muted)">Qty: {{ item.quantity }} × ₹{{ item.unit_price | number }}</span>
                    </div>
                    <strong style="color:var(--primary-dark)">₹{{ item.total_price | number }}</strong>
                  </div>
                }
              </div>
            </div>

            <div class="od-sidebar">
              <!-- Price Summary -->
              <div class="detail-section">
                <h3>Price Summary</h3>
                <div style="display:flex;flex-direction:column;gap:10px">
                  <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)"><span>Subtotal</span><span>₹{{ order()!.subtotal | number }}</span></div>
                  <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)"><span>Tax</span><span>₹{{ order()!.tax_amount | number }}</span></div>
                  <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)"><span>Shipping</span><span>{{ order()!.shipping_amount === 0 ? 'FREE' : '₹' + (order()!.shipping_amount | number) }}</span></div>
                  <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.125rem;border-top:2px solid var(--primary);padding-top:10px"><span>Total</span><span>₹{{ order()!.total_amount | number }}</span></div>
                </div>
              </div>

              <!-- Shipping Address -->
              <div class="detail-section">
                <h3><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
                <div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7">
                  <strong>{{ order()!.shipping_address.full_name }}</strong><br>
                  {{ order()!.shipping_address.address_line1 }}<br>
                  {{ order()!.shipping_address.city }}, {{ order()!.shipping_address.state }}<br>
                  {{ order()!.shipping_address.pincode }}<br>
                  📞 {{ order()!.shipping_address.phone }}
                </div>
              </div>

              <!-- Cancel -->
              @if (['pending','confirmed'].includes(order()!.status)) {
                <button class="btn btn-danger btn-full" (click)="cancelOrder(order()!.id)">
                  <i class="fas fa-times"></i> Cancel Order
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .od-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .od-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
    .od-sidebar .detail-section { margin-bottom: 20px; }
    .detail-section { background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border-color); margin-bottom: 20px; }
    .detail-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; color: var(--text-primary); padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
    .timeline { display: flex; flex-direction: column; }
    .timeline-item { display: flex; gap: 16px; position: relative; padding-bottom: 20px; }
    .tl-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--border-color); border: 2px solid var(--bg-card); flex-shrink: 0; margin-top: 4px; position: relative; z-index: 1; }
    .timeline-item.latest .tl-dot { background: var(--primary); }
    .tl-line { position: absolute; left: 6px; top: 18px; bottom: 0; width: 2px; background: var(--border-color); }
    .tl-content { flex: 1; padding-bottom: 4px; }
    .tl-content strong { display: block; font-size: 0.9375rem; color: var(--text-primary); margin-bottom: 2px; }
    .tl-content p { font-size: 0.875rem; color: var(--text-secondary); margin: 0 0 4px; }
    .tl-content span { font-size: 0.8125rem; color: var(--text-muted); }
    .item-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
    .item-row:last-child { border-bottom: none; }
    @media(max-width:1024px) { .od-layout { grid-template-columns: 1fr; } }
  `]
})
export class OrderDetailComponent implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private orderService: OrderService, private toast: ToastService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderById(+id).subscribe({
      next: res => { if (res.success && res.data) this.order.set(res.data); this.loading.set(false); },
      error: () => { this.order.set(this.getDemoOrder(+id)); this.loading.set(false); }
    });
  }

  cancelOrder(id: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(id, 'Cancelled by customer').subscribe({
        next: () => { this.toast.success('Order cancelled'); this.order.update(o => o ? {...o, status: 'cancelled'} : o); },
        error: () => this.toast.error('Failed to cancel order')
      });
    }
  }

  getDemoOrder(id: number): Order {
    return {
      id, order_number: 'CC-ABC123-XYZ', status: 'manufacturing',
      subtotal: 39999, tax_amount: 7200, shipping_amount: 0, discount_amount: 0, total_amount: 47199,
      payment_method: 'online', payment_status: 'paid',
      shipping_address: { full_name: 'Rahul Sharma', phone: '9876543210', address_line1: '42, Park Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India' },
      estimated_delivery: '2024-11-15', created_at: '2024-10-25',
      items: [{ id: 1, product_id: 1, product_name: 'Royal Oak Sofa Set', quantity: 1, unit_price: 39999, total_price: 39999, thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=60' }],
      tracking: [
        { id: 3, order_id: id, status: 'Manufacturing Started', description: 'Craftsmen have started building your custom furniture.', created_at: '2024-10-27T10:00:00Z' },
        { id: 2, order_id: id, status: 'Payment Confirmed', description: 'Your payment has been received and verified.', created_at: '2024-10-25T14:30:00Z' },
        { id: 1, order_id: id, status: 'Order Placed', description: 'Your order has been placed successfully.', created_at: '2024-10-25T12:00:00Z' },
      ]
    };
  }
}
