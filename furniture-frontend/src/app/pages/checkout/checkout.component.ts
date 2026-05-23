import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  step = signal(1); // 1: Address, 2: Payment, 3: Confirm
  loading = signal(false);
  cartItems = signal<any[]>([]);
  couponCode = signal('');
  couponDiscount = signal(0);
  paymentMethod = signal<'online' | 'cod' | 'emi'>('online');

  address = signal({
    full_name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', pincode: '', country: 'India'
  });

  summary = computed(() => {
    const subtotal = this.cartItems().reduce((s: number, i: any) => s + i.item_total, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 25000 ? 0 : 999;
    const total = subtotal + tax + shipping - this.couponDiscount();
    return { subtotal, tax, shipping, total };
  });

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cartService.loadCart().subscribe({
      next: res => { if (res.success && res.data) this.cartItems.set(res.data.items); }
    });
    const user = this.authService.currentUser();
    if (user) {
      this.address.update(a => ({ ...a, full_name: `${user.first_name} ${user.last_name}`, phone: user.phone || '' }));
    }
  }

  applyCoupon() {
    if (!this.couponCode()) return;
    this.http.get<any>(`${environment.apiUrl}/coupons/validate/${this.couponCode()}`).subscribe({
      next: res => {
        if (res.success) {
          const coupon = res.data;
          const subtotal = this.summary().subtotal;
          if (subtotal < coupon.min_purchase_amount) {
            this.toast.error(`Minimum order ₹${coupon.min_purchase_amount} required`); return;
          }
          let discount = coupon.discount_type === 'percentage' ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
          if (coupon.max_discount_amount) discount = Math.min(discount, coupon.max_discount_amount);
          this.couponDiscount.set(discount);
          this.toast.success(`Coupon applied! You save ₹${discount.toFixed(0)}`);
        }
      },
      error: () => this.toast.error('Invalid or expired coupon code')
    });
  }

  updateAddress(field: string, value: string) {
    this.address.update(a => ({ ...a, [field]: value }));
  }

  nextStep() {
    if (this.step() === 1) {
      const a = this.address();
      if (!a.full_name || !a.phone || !a.address_line1 || !a.city || !a.state || !a.pincode) {
        this.toast.error('Please fill all required address fields'); return;
      }
    }
    this.step.update(s => s + 1);
  }

  placeOrder() {
    this.loading.set(true);
    const items = this.cartItems().map(i => ({ product_id: i.product_id, quantity: i.quantity, custom_price: i.custom_price, customization_details: i.customization_details }));
    const payload = { items, shipping_address: this.address(), payment_method: this.paymentMethod(), coupon_code: this.couponCode() || undefined };

    this.orderService.createOrder(payload).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success('Order placed successfully! 🎉', 'Order Confirmed');
          this.router.navigate(['/orders', res.data.order_id]);
        }
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(err.error?.message || 'Failed to place order. Please try again.');
      }
    });
  }
}
