import { supabase } from '@/lib/supabase';
import type { Coupon, Store, Category, CouponWithRelations } from '@/types';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
  if (error) throw error;
  return (data || []) as Category[];
}

export async function fetchStores(): Promise<Store[]> {
  const { data, error } = await supabase.from('stores').select('*').order('is_featured', { ascending: false }).order('rating', { ascending: false });
  if (error) throw error;
  return (data || []) as Store[];
}

export async function fetchStoreBySlug(slug: string): Promise<Store | null> {
  const { data, error } = await supabase.from('stores').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as Store | null;
}

export async function fetchCoupons(filter?: {
  categoryId?: string; storeId?: string; search?: string;
  featuredOnly?: boolean; activeOnly?: boolean;
  sortBy?: 'latest' | 'popular' | 'ending_soon'; limit?: number;
}): Promise<CouponWithRelations[]> {
  let query = supabase.from('coupons').select('*, store:stores(*), category:categories(*)').eq('is_active', true);
  if (filter?.categoryId) query = query.eq('category_id', filter.categoryId);
  if (filter?.storeId) query = query.eq('store_id', filter.storeId);
  if (filter?.featuredOnly) query = query.eq('is_featured', true);
  if (filter?.search) query = query.or(`title.ilike.%${filter.search}%,code.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
  if (filter?.sortBy === 'popular') query = query.order('usage_count', { ascending: false });
  else if (filter?.sortBy === 'ending_soon') query = query.order('expires_at', { ascending: true });
  else query = query.order('created_at', { ascending: false });
  if (filter?.limit) query = query.limit(filter.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as CouponWithRelations[];
}

export async function fetchCouponsByStore(storeId: string): Promise<CouponWithRelations[]> {
  const { data, error } = await supabase.from('coupons').select('*, store:stores(*), category:categories(*)').eq('store_id', storeId).order('is_active', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as CouponWithRelations[];
}

export async function fetchAllCouponsAdmin(): Promise<CouponWithRelations[]> {
  const { data, error } = await supabase.from('coupons').select('*, store:stores(*), category:categories(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as CouponWithRelations[];
}

export async function trackCouponUsage(couponId: string, userId?: string): Promise<void> {
  const { error } = await supabase.rpc('increment_coupon_usage', { coupon_uuid: couponId });
  if (error) {
    await supabase.from('coupon_usage').insert({ coupon_id: couponId, user_id: userId ?? null });
  }
}

export async function createCoupon(input: Omit<Coupon, 'id' | 'created_at' | 'usage_count'>): Promise<Coupon> {
  const { data, error } = await supabase.from('coupons').insert(input).select().single();
  if (error) throw error;
  return data as Coupon;
}

export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
  const { data, error } = await supabase.from('coupons').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Coupon;
}

export async function deleteCoupon(id: string): Promise<void> {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
}

export async function createCategory(input: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(input).select().single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function createStore(input: Omit<Store, 'id' | 'created_at'>): Promise<Store> {
  const { data, error } = await supabase.from('stores').insert(input).select().single();
  if (error) throw error;
  return data as Store;
}

export async function updateStore(id: string, updates: Partial<Store>): Promise<Store> {
  const { data, error } = await supabase.from('stores').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Store;
}

export async function deleteStore(id: string): Promise<void> {
  const { error } = await supabase.from('stores').delete().eq('id', id);
  if (error) throw error;
}
