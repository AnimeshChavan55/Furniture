// ======================================================
// CustomCraft Furniture - TypeScript Data Models
// ======================================================

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: { token: string; user: User; };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
}

export interface ProductImage { id: number; image_url: string; alt_text?: string; is_primary: boolean; sort_order: number; }

export interface CustomizationOption {
  id: number;
  product_id: number;
  option_type: 'size' | 'wood_type' | 'color' | 'fabric' | 'design' | 'accessory';
  option_name: string;
  option_value: string;
  price_modifier: number;
  preview_image?: string;
  hex_color?: string;
  is_available: boolean;
  sort_order?: number;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  base_price: number;
  sale_price?: number;
  sku?: string;
  stock_quantity: number;
  thumbnail?: string;
  is_featured: boolean;
  is_customizable: boolean;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  total_sold: number;
  category_name?: string;
  category_slug?: string;
  images?: ProductImage[];
  customization_options?: { [key: string]: CustomizationOption[] };
  reviews?: Review[];
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string;
  review_text?: string;
  is_verified_purchase: boolean;
  created_at: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  quantity: number;
  unit_price: number;
  item_total: number;
  thumbnail?: string;
  customization_details?: SelectedCustomization;
  custom_price?: number;
  stock_quantity: number;
}

export interface SelectedCustomization {
  size?: CustomizationOption;
  wood_type?: CustomizationOption;
  color?: CustomizationOption;
  fabric?: CustomizationOption;
  design?: CustomizationOption;
  [key: string]: CustomizationOption | undefined;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  item_count: number;
}

export interface Cart { items: CartItem[]; summary: CartSummary; }

export interface Address {
  id?: number;
  address_type?: 'home' | 'office' | 'other';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default?: boolean;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  thumbnail?: string;
  customization_details?: any;
}

export interface OrderTracking { id: number; order_id?: number; status: string; description: string; location?: string; created_at: string; }

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'online' | 'cod' | 'emi';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: Address;
  estimated_delivery: string;
  created_at: string;
  items?: OrderItem[];
  tracking?: OrderTracking[];
  item_count?: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'manufacturing' | 'quality_check' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  featured?: boolean;
  customizable?: boolean;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  base_price: number;
  sale_price?: number;
  thumbnail?: string;
  average_rating: number;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  total_products: number;
  pending_orders: number;
}

export interface AdminDashboard {
  stats: DashboardStats;
  monthly_sales: { month: string; orders: number; revenue: number; }[];
  top_products: { name: string; thumbnail: string; total_sold: number; revenue: number; }[];
  recent_orders: { order_number: string; status: string; total_amount: number; created_at: string; first_name: string; last_name: string; }[];
  order_status_dist: { status: string; count: number; }[];
}

export interface InventoryItem {
  product_id: number;
  name: string;
  sku?: string;
  thumbnail?: string;
  category_name: string;
  quantity_available: number;
  quantity_reserved: number;
  quantity_sold: number;
  reorder_level: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}
