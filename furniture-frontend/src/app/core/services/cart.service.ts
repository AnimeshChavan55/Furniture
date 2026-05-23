import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Cart, CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.item_total, 0));

  constructor(private http: HttpClient) {}

  loadCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl).pipe(
      tap(res => { if (res.success && res.data) this.cartItems.set(res.data.items); })
    );
  }

  addToCart(product_id: number, quantity = 1, customization_details?: any, custom_price?: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, { product_id, quantity, customization_details, custom_price }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  updateItem(id: number, quantity: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, { quantity }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  removeItem(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cartItems.update(items => items.filter(i => i.id !== id)))
    );
  }

  clearCart(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.apiUrl).pipe(
      tap(() => this.cartItems.set([]))
    );
  }

  getCartSummary() {
    const subtotal = this.cartTotal();
    const tax = subtotal * 0.18;
    const shipping = subtotal > 25000 ? 0 : 999;
    return { subtotal, tax, shipping, total: subtotal + tax + shipping };
  }
}
