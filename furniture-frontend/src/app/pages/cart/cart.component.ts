import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loading = signal(true);
  items = signal<CartItem[]>([]);

  summary = computed(() => {
    const subtotal = this.items().reduce((s, i) => s + i.item_total, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 25000 ? 0 : 999;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  });

  constructor(
    public cartService: CartService,
    private toast: ToastService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.loadCart().subscribe({
      next: res => { if (res.success && res.data) this.items.set(res.data.items); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  updateQty(item: CartItem, qty: number) {
    this.cartService.updateItem(item.id, qty).subscribe({
      next: () => {
        this.items.update(items => items.map(i => i.id === item.id ? { ...i, quantity: qty, item_total: i.unit_price * qty } : i).filter(i => i.quantity > 0));
        this.cartService.loadCart().subscribe();
      }
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id).subscribe({
      next: () => {
        this.items.update(items => items.filter(i => i.id !== item.id));
        this.toast.success(`${item.name} removed from cart`);
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({ next: () => { this.items.set([]); this.toast.info('Cart cleared'); } });
  }

  proceedToCheckout() {
    if (!this.authService.isAuthenticated()) {
      this.toast.error('Please login to proceed to checkout', 'Login Required');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
