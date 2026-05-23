import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, CustomizationOption, SelectedCustomization } from '../../core/models';

@Component({
  selector: 'app-customize',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.css']
})
export class CustomizeComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  selected = signal<SelectedCustomization>({});
  quantity = signal(1);

  basePrice = computed(() => this.product()?.sale_price || this.product()?.base_price || 0);

  customPrice = computed(() => {
    let price = this.basePrice();
    const sel = this.selected();
    Object.values(sel).forEach(opt => { if (opt) price += opt.price_modifier; });
    return price * this.quantity();
  });

  hasSelections = computed(() => Object.keys(this.selected()).length > 0);

  deliveryDate = computed(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  optionTypes = ['size', 'wood_type', 'color', 'fabric', 'design', 'accessory'];
  optionLabels: Record<string, string> = {
    size: '📐 Size & Configuration',
    wood_type: '🪵 Wood Type',
    color: '🎨 Color & Finish',
    fabric: '🧵 Fabric & Cushions',
    design: '✨ Design Pattern',
    accessory: '🔧 Additional Accessories'
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.productService.getProductBySlug(slug).subscribe({
      next: res => { if (res.success && res.data) this.product.set(res.data); this.loading.set(false); },
      error: () => { this.product.set(this.getDemoProduct(slug)); this.loading.set(false); }
    });
  }

  selectOption(type: string, option: CustomizationOption) {
    this.selected.update(s => ({ ...s, [type]: option }));
  }

  isSelected(type: string, option: CustomizationOption): boolean {
    return this.selected()[type]?.id === option.id;
  }

  getAvailableTypes(): string[] {
    const opts = this.product()?.customization_options;
    if (!opts) return [];
    return this.optionTypes.filter(t => opts[t] && opts[t].length > 0);
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p.id, this.quantity(), this.selected(), this.customPrice() / this.quantity()).subscribe({
      next: () => {
        this.toast.success('Customized furniture added to cart!', 'Added to Cart');
        this.router.navigate(['/cart']);
      },
      error: () => this.toast.error('Please login to add to cart', 'Login Required')
    });
  }

  changeQty(delta: number) {
    const newQty = this.quantity() + delta;
    if (newQty >= 1 && newQty <= 10) this.quantity.set(newQty);
  }

  getDemoProduct(slug: string): Product {
    return {
      id: 1, category_id: 1, name: 'Royal Oak Sofa Set', slug,
      short_description: 'Premium 3+2 sofa set in solid teak wood',
      base_price: 45999, sale_price: 39999,
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      is_featured: true, is_customizable: true, is_active: true,
      average_rating: 4.5, total_reviews: 42, total_sold: 85, stock_quantity: 25,
      category_name: 'Living Room',
      customization_options: {
        size: [
          { id: 1, product_id: 1, option_type: 'size', option_name: '2 Seater', option_value: '2-seater', price_modifier: -8000, is_available: true, sort_order: 1 },
          { id: 2, product_id: 1, option_type: 'size', option_name: '3 Seater', option_value: '3-seater', price_modifier: 0, is_available: true, sort_order: 2 },
          { id: 3, product_id: 1, option_type: 'size', option_name: '3+2 Seater', option_value: '3-2-seater', price_modifier: 8000, is_available: true, sort_order: 3 },
          { id: 4, product_id: 1, option_type: 'size', option_name: 'L-Shape', option_value: 'l-shape', price_modifier: 15000, is_available: true, sort_order: 4 },
        ],
        wood_type: [
          { id: 5, product_id: 1, option_type: 'wood_type', option_name: 'Teak Wood', option_value: 'teak', price_modifier: 0, is_available: true, sort_order: 1 },
          { id: 6, product_id: 1, option_type: 'wood_type', option_name: 'Sheesham', option_value: 'sheesham', price_modifier: -2000, is_available: true, sort_order: 2 },
          { id: 7, product_id: 1, option_type: 'wood_type', option_name: 'Mango Wood', option_value: 'mango', price_modifier: -3000, is_available: true, sort_order: 3 },
          { id: 8, product_id: 1, option_type: 'wood_type', option_name: 'Walnut', option_value: 'walnut', price_modifier: 5000, is_available: true, sort_order: 4 },
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
      }
    };
  }
}
