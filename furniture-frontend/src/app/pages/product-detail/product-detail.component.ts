import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, CustomizationOption } from '../../core/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  selectedImage = signal(0);
  quantity = signal(1);
  activeTab = signal<'description' | 'specs' | 'reviews'>('description');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.productService.getProductBySlug(slug).subscribe({
      next: res => {
        if (res.success && res.data) this.product.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.product.set(this.getDemoProduct(slug));
        this.loading.set(false);
      }
    });
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p.id, this.quantity()).subscribe({
      next: () => this.toast.success(`${p.name} added to cart!`, 'Added to Cart'),
      error: () => this.toast.error('Please login to add to cart', 'Login Required')
    });
  }

  submitReview(form: any) {
    const p = this.product();
    if (!p) return;
    this.http.post(`${environment.apiUrl}/reviews`, { product_id: p.id, ...form }).subscribe({
      next: () => this.toast.success('Review submitted! It will appear after approval.'),
      error: () => this.toast.error('Please login to submit a review')
    });
  }

  changeQty(delta: number) {
    const newQty = this.quantity() + delta;
    const max = this.product()?.stock_quantity || 99;
    if (newQty >= 1 && newQty <= max) this.quantity.set(newQty);
  }

  getDiscountPercentage(): number {
    const p = this.product();
    if (!p || !p.sale_price) return 0;
    return Math.round(((p.base_price - p.sale_price) / p.base_price) * 100);
  }

  getDemoProduct(slug: string): Product {
    return {
      id: 1, category_id: 1, name: 'Royal Oak Sofa Set', slug,
      description: `<p>The Royal Oak Sofa Set is the pinnacle of luxury living. Crafted from premium Grade-A Teak wood sourced sustainably from certified forests, each piece undergoes meticulous hand-finishing by our master artisans with over 20 years of experience.</p><p>The cushions are filled with high-resilience foam wrapped in Dacron fiber, ensuring comfort that lasts decades. The upholstery fabric is pre-treated for stain resistance and UV stability.</p>`,
      short_description: 'Premium 3+2 sofa set in solid teak wood',
      base_price: 45999, sale_price: 39999,
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      is_featured: true, is_customizable: true, is_active: true,
      average_rating: 4.5, total_reviews: 42, total_sold: 85, stock_quantity: 25,
      weight: 85, dimensions_length: 220, dimensions_width: 90, dimensions_height: 85,
      category_name: 'Living Room', category_slug: 'living-room',
      images: [
        { id: 1, image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', alt_text: 'Sofa Set', is_primary: true, sort_order: 0 },
        { id: 2, image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', alt_text: 'Side View', is_primary: false, sort_order: 1 },
        { id: 3, image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80', alt_text: 'Detail', is_primary: false, sort_order: 2 },
      ],
      customization_options: {
        size: [
          { id: 1, product_id: 1, option_type: 'size', option_name: '2 Seater', option_value: '2-seater', price_modifier: -8000, is_available: true, sort_order: 1 },
          { id: 2, product_id: 1, option_type: 'size', option_name: '3 Seater', option_value: '3-seater', price_modifier: 0, is_available: true, sort_order: 2 },
          { id: 3, product_id: 1, option_type: 'size', option_name: '3+2 Seater', option_value: '3-2-seater', price_modifier: 8000, is_available: true, sort_order: 3 },
          { id: 4, product_id: 1, option_type: 'size', option_name: 'L-Shape', option_value: 'l-shape', price_modifier: 15000, is_available: true, sort_order: 4 },
        ],
        color: [
          { id: 9, product_id: 1, option_type: 'color', option_name: 'Honey Oak', option_value: 'honey-oak', price_modifier: 0, hex_color: '#C68642', is_available: true, sort_order: 1 },
          { id: 10, product_id: 1, option_type: 'color', option_name: 'Dark Walnut', option_value: 'dark-walnut', price_modifier: 0, hex_color: '#4A2C0A', is_available: true, sort_order: 2 },
          { id: 11, product_id: 1, option_type: 'color', option_name: 'Natural Teak', option_value: 'natural-teak', price_modifier: 0, hex_color: '#9B6B3C', is_available: true, sort_order: 3 },
          { id: 12, product_id: 1, option_type: 'color', option_name: 'Mahogany', option_value: 'mahogany', price_modifier: 0, hex_color: '#7B3C2A', is_available: true, sort_order: 4 },
        ],
        fabric: [
          { id: 13, product_id: 1, option_type: 'fabric', option_name: 'Premium Cotton', option_value: 'cotton', price_modifier: 0, is_available: true, sort_order: 1 },
          { id: 14, product_id: 1, option_type: 'fabric', option_name: 'Velvet', option_value: 'velvet', price_modifier: 3000, is_available: true, sort_order: 2 },
          { id: 15, product_id: 1, option_type: 'fabric', option_name: 'Linen', option_value: 'linen', price_modifier: 1000, is_available: true, sort_order: 3 },
          { id: 16, product_id: 1, option_type: 'fabric', option_name: 'Leather', option_value: 'leather', price_modifier: 8000, is_available: true, sort_order: 4 },
        ]
      },
      reviews: [
        { id: 1, product_id: 1, user_id: 2, rating: 5, title: 'Absolutely stunning!', review_text: 'Worth every penny. The teak wood quality is exceptional.', is_verified_purchase: true, created_at: '2024-10-15', first_name: 'Rahul', last_name: 'Sharma' },
        { id: 2, product_id: 1, user_id: 3, rating: 4, title: 'Great quality furniture', review_text: 'Beautiful sofa set. Delivery was on time and the team was professional.', is_verified_purchase: true, created_at: '2024-10-20', first_name: 'Priya', last_name: 'Patel' },
      ]
    };
  }
}
