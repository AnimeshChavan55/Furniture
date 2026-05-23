import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, ProductFilter } from '../../core/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  totalProducts = signal(0);
  totalPages = signal(1);
  currentPage = signal(1);
  searchText = signal('');

  filters = signal<ProductFilter>({ page: 1, limit: 12, sort: 'created_at', order: 'DESC' });

  sortOptions = [
    { value: 'created_at-DESC', label: 'Newest First' },
    { value: 'created_at-ASC', label: 'Oldest First' },
    { value: 'base_price-ASC', label: 'Price: Low to High' },
    { value: 'base_price-DESC', label: 'Price: High to Low' },
    { value: 'average_rating-DESC', label: 'Best Rated' },
    { value: 'total_sold-DESC', label: 'Most Popular' },
  ];

  priceRanges = [
    { label: 'Under ₹10,000', min: 0, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: 999999 },
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filters.update(f => ({
        ...f,
        category: params['category'] || undefined,
        featured: params['featured'] === 'true' ? true : undefined,
        customizable: params['customizable'] === 'true' ? true : undefined,
        search: params['search'] || undefined,
        page: 1
      }));
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getProducts(this.filters()).subscribe({
      next: res => {
        if (res.success) {
          this.products.set(res.data || []);
          this.totalProducts.set(res.pagination?.total || 0);
          this.totalPages.set(res.pagination?.pages || 1);
          this.currentPage.set(res.pagination?.page || 1);
        }
        this.loading.set(false);
      },
      error: () => {
        this.products.set(this.getDemoProducts());
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.filters.update(f => ({ ...f, search: this.searchText(), page: 1 }));
    this.loadProducts();
  }

  onSortChange(value: string) {
    const [sort, order] = value.split('-');
    this.filters.update(f => ({ ...f, sort, order: order as 'ASC' | 'DESC', page: 1 }));
    this.loadProducts();
  }

  onPriceFilter(min: number, max: number) {
    this.filters.update(f => ({ ...f, min_price: min, max_price: max, page: 1 }));
    this.loadProducts();
  }

  clearFilters() {
    this.filters.set({ page: 1, limit: 12, sort: 'created_at', order: 'DESC' });
    this.searchText.set('');
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.filters.update(f => ({ ...f, page }));
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  updateFilterCategory(category?: string) {
    this.filters.update(f => ({ ...f, category, page: 1 }));
    this.loadProducts();
  }

  toggleFilter(key: 'featured' | 'customizable') {
    this.filters.update(f => ({ ...f, [key]: !f[key as keyof ProductFilter], page: 1 }));
    this.loadProducts();
  }

  addToCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product.id).subscribe({
      next: () => this.toast.success(`${product.name} added to cart!`),
      error: () => this.toast.error('Please login to add to cart')
    });
  }

  getDiscountPercentage(product: Product): number {
    if (!product.sale_price) return 0;
    return Math.round(((product.base_price - product.sale_price) / product.base_price) * 100);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getDemoProducts(): Product[] {
    return [
      { id: 1, category_id: 1, name: 'Royal Oak Sofa Set', slug: 'royal-oak-sofa-set', short_description: 'Premium 3+2 sofa set', base_price: 45999, sale_price: 39999, thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.5, total_reviews: 42, total_sold: 85, stock_quantity: 25, category_name: 'Living Room' },
      { id: 2, category_id: 2, name: 'King Size Platform Bed', slug: 'king-size-platform-bed', short_description: 'Stunning king size bed', base_price: 55999, sale_price: 48999, thumbnail: 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.7, total_reviews: 56, total_sold: 120, stock_quantity: 15, category_name: 'Bedroom' },
      { id: 3, category_id: 3, name: 'Extendable Dining Set', slug: 'extendable-dining-table-set', short_description: '6-8 seater dining set', base_price: 42999, sale_price: 36999, thumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.6, total_reviews: 47, total_sold: 95, stock_quantity: 20, category_name: 'Dining Room' },
      { id: 4, category_id: 4, name: 'Executive Chair', slug: 'executive-boss-chair', short_description: 'High-back executive chair', base_price: 15999, sale_price: 12999, thumbnail: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80', is_featured: true, is_customizable: false, is_active: true, average_rating: 4.2, total_reviews: 24, total_sold: 67, stock_quantity: 35, category_name: 'Office' },
      { id: 5, category_id: 1, name: 'Walnut Coffee Table', slug: 'walnut-coffee-table', short_description: 'Hand-crafted walnut table', base_price: 12999, sale_price: 10999, thumbnail: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.3, total_reviews: 28, total_sold: 58, stock_quantity: 40, category_name: 'Living Room' },
      { id: 6, category_id: 2, name: '6-Door Sliding Wardrobe', slug: 'wardrobe-6-door-sliding', short_description: 'Spacious 6-door wardrobe', base_price: 38999, sale_price: 32999, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', is_featured: true, is_customizable: true, is_active: true, average_rating: 4.4, total_reviews: 33, total_sold: 72, stock_quantity: 12, category_name: 'Bedroom' },
    ];
  }
}
