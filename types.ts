
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED'
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  zip: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  addresses: Address[];
  kycVerified?: boolean;
}

export interface ProductVariant {
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  detailedDescription?: string;
  price: number;
  category: 'Men' | 'Women' | 'Unisex';
  subcategory: string;
  gender: 'Men' | 'Women' | 'Unisex';
  fabric?: string;
  fit?: string;
  occasion?: string;
  sellerId: string;
  images: string[];
  stock: number;
  rating: number;
  isModerated?: boolean;
  variants: ProductVariant[];
  reviews: Review[];
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED'
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sellerId: string;
  variant?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Campaign {
  id: string;
  title: string;
  discountCode: string;
  isActive: boolean;
}

export interface PlatformSettings {
  commissionPercentage: number;
  gstPercentage: number;
}
