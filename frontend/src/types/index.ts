export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  product_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  unit: string;
  stock: number;
  in_stock: boolean;
  category: string;
  category_name: string;
  primary_image: string | null;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  unit: string;
  stock: number;
  in_stock: boolean;
  category: string;
  category_name: string;
  seller_name: string;
  images: ProductImage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product: ProductListItem;
  quantity: number;
  subtotal: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  updated_at: string;
}

export interface DeliveryAddress {
  id?: number;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  is_default?: boolean;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  status: "pending" | "paid" | "failed" | "shipped" | "delivered" | "cancelled";
  total_amount: string;
  address: DeliveryAddress;
  items: OrderItem[];
  razorpay_order_id: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_seller: boolean;
  date_joined: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
