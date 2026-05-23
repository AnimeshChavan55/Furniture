import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts = signal<Product[]>([]);
  loading = signal(true);
  wishlistIds = signal<Set<number>>(new Set());

  categories = [
    { name: 'Living Room', slug: 'living-room', icon: '🛋️', count: '42 items', color: '#8B5E3C' },
    { name: 'Bedroom', slug: 'bedroom', icon: '🛏️', count: '38 items', color: '#5C4033' },
    { name: 'Dining Room', slug: 'dining-room', icon: '🍽️', count: '25 items', color: '#9B6B3C' },
    { name: 'Office', slug: 'office', icon: '💼', count: '30 items', color: '#6B4226' },
    { name: 'Outdoor', slug: 'outdoor', icon: '🌿', count: '18 items', color: '#4A7C59' },
    { name: 'Kids Room', slug: 'kids-room', icon: '🎠', count: '22 items', color: '#7B5EA7' },
  ];

  stats = [
    { value: '10,000+', label: 'Happy Customers', icon: '😊' },
    { value: '500+', label: 'Custom Designs', icon: '🎨' },
    { value: '15+', label: 'Years Experience', icon: '🏆' },
    { value: '50+', label: 'Expert Craftsmen', icon: '🔨' },
  ];

  testimonials = [
    {
      name: 'Priya Sharma', location: 'Mumbai', rating: 5,
      text: 'The customization process was incredibly smooth. I designed my dream sofa and it arrived exactly as I envisioned. Premium quality and excellent craftsmanship!',
      product: 'Custom Teak Sofa Set'
    },
    {
      name: 'Rahul Patel', location: 'Pune', rating: 5,
      text: 'Ordered a king-size bed with hydraulic storage. The delivery team was professional and setup was flawless. Worth every rupee!',
      product: 'King Size Platform Bed'
    },
    {
      name: 'Anita Mehta', location: 'Delhi', rating: 5,
      text: 'CustomCraft transformed my living room completely. The walnut coffee table is a conversation starter every time guests visit.',
      product: 'Walnut Coffee Table'
    }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.productService.getFeaturedProducts().subscribe({
      next: res => {
        if (res.success && res.data) this.featuredProducts.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        // Use demo data if API unavailable
        this.featuredProducts.set(this.getDemoProducts());
        this.loading.set(false);
      }
    });
  }

  addToCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product.id).subscribe({
      next: () => this.toast.success(`${product.name} added to cart!`, 'Added to Cart'),
      error: () => this.toast.error('Please login to add items to cart', 'Login Required')
    });
  }

  toggleWishlist(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toast.info(`${product.name} added to wishlist!`, 'Wishlist');
  }

  getDiscountPercentage(product: Product): number {
    if (!product.sale_price) return 0;
    return Math.round(((product.base_price - product.sale_price) / product.base_price) * 100);
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  getDemoProducts(): Product[] {
    return [
      { id: 1, category_id: 1, name: 'Royal Oak Sofa Set', slug: 'royal-oak-sofa-set', short_description: 'Premium 3+2 sofa set in solid teak wood', base_price: 45999, sale_price: 39999, thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.5, total_reviews: 42, total_sold: 85, stock_quantity: 25, category_name: 'Living Room' },
      { id: 2, category_id: 2, name: 'King Size Platform Bed', slug: 'king-size-platform-bed', short_description: 'Stunning king size bed with hydraulic storage', base_price: 55999, sale_price: 48999, thumbnail: 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.7, total_reviews: 56, total_sold: 120, stock_quantity: 15, category_name: 'Bedroom' },
      { id: 3, category_id: 3, name: 'Extendable Dining Set', slug: 'extendable-dining-table-set', short_description: '6-8 seater extendable dining set in mango wood', base_price: 42999, sale_price: 36999, thumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.6, total_reviews: 47, total_sold: 95, stock_quantity: 20, category_name: 'Dining Room' },
      { id: 4, category_id: 4, name: 'Executive Boss Chair', slug: 'executive-boss-chair', short_description: 'High-back executive chair with lumbar support', base_price: 15999, sale_price: 12999, thumbnail: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80', is_featured: true, is_customizable: false, is_active: true, average_rating: 4.2, total_reviews: 24, total_sold: 67, stock_quantity: 35, category_name: 'Office' },
      { id: 5, category_id: 1, name: 'Walnut Coffee Table', slug: 'walnut-coffee-table', short_description: 'Hand-crafted walnut coffee table with glass top', base_price: 12999, sale_price: 10999, thumbnail: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.3, total_reviews: 28, total_sold: 58, stock_quantity: 40, category_name: 'Living Room' },
      { id: 6, category_id: 2, name: '6-Door Sliding Wardrobe', slug: 'wardrobe-6-door-sliding', short_description: 'Spacious 6-door sliding wardrobe with mirrors', base_price: 38999, sale_price: 32999, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.4, total_reviews: 33, total_sold: 72, stock_quantity: 12, category_name: 'Bedroom' },
      { id: 7, category_id: 1, name: 'Rocking Armchair', slug: 'rocking-armchair', short_description: 'Classic rocking armchair in solid teak with cane back', base_price: 8999, sale_price: 7499, thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.4, total_reviews: 21, total_sold: 44, stock_quantity: 30, category_name: 'Living Room' },
      { id: 8, category_id: 1, name: 'Sheesham TV Unit', slug: 'sheesham-wood-tv-unit', short_description: 'Solid Sheesham wood TV unit with storage', base_price: 18999, sale_price: 15999, thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.1, total_reviews: 19, total_sold: 38, stock_quantity: 18, category_name: 'Living Room' }
    ];
  }
}
