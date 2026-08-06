export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string;
  logo_color: string;
  description: string;
  banner_color: string;
  website: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

export type DiscountType = 'fixed' | 'percent' | 'free_shipping' | 'gift';

export interface Coupon {
  id: string;
  store_id: string;
  category_id: string | null;
  title: string;
  description: string;
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  expires_at: string;
  is_featured: boolean;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  store?: Store;
  category?: Category | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  coupon_id: string;
  created_at: string;
  coupon?: Coupon;
}

export interface StoreFavorite {
  id: string;
  user_id: string;
  store_id: string;
  created_at: string;
  store?: Store;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'coupon';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  store_id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
  profile?: Profile | null;
}

export interface Analytics {
  id: string;
  date: string;
  visitors: number;
  new_users: number;
  coupons_used: number;
  page_views: number;
}

export interface CouponWithRelations extends Coupon {
  store: Store;
  category: Category | null;
}

export interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
