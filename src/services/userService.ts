import { supabase } from '@/lib/supabase';
import type { Favorite, StoreFavorite, Notification, Comment, Profile, Analytics } from '@/types';

export async function fetchFavorites(userId: string) {
  const { data, error } = await supabase.from('favorites').select('*, coupon:coupons(*, store:stores(*), category:categories(*))').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as (Favorite & { coupon: NonNullable<Favorite['coupon']> })[];
}

export async function toggleFavorite(userId: string, couponId: string): Promise<boolean> {
  const { data: existing } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('coupon_id', couponId).maybeSingle();
  if (existing) { await supabase.from('favorites').delete().eq('id', existing.id); return false; }
  await supabase.from('favorites').insert({ user_id: userId, coupon_id: couponId });
  return true;
}

export async function fetchStoreFavorites(userId: string) {
  const { data, error } = await supabase.from('store_favorites').select('*, store:stores(*)').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as (StoreFavorite & { store: NonNullable<StoreFavorite['store']> })[];
}

export async function toggleStoreFavorite(userId: string, storeId: string): Promise<boolean> {
  const { data: existing } = await supabase.from('store_favorites').select('id').eq('user_id', userId).eq('store_id', storeId).maybeSingle();
  if (existing) { await supabase.from('store_favorites').delete().eq('id', existing.id); return false; }
  await supabase.from('store_favorites').insert({ user_id: userId, store_id: storeId });
  return true;
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Notification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  if (error) throw error;
}

export async function fetchComments(storeId: string) {
  const { data, error } = await supabase.from('comments').select('*, profile:profiles(*)').eq('store_id', storeId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as (Comment & { profile: Profile | null })[];
}

export async function addComment(userId: string, storeId: string, content: string, rating: number) {
  const { data, error } = await supabase.from('comments').insert({ user_id: userId, store_id: storeId, content, rating }).select('*, profile:profiles(*)').single();
  if (error) throw error;
  return data;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: { display_name?: string; avatar_url?: string }): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
  if (error) throw error;
  return data as Profile;
}

export async function fetchAnalytics(): Promise<Analytics[]> {
  const { data, error } = await supabase.from('analytics').select('*').order('date', { ascending: true }).limit(7);
  if (error) throw error;
  return (data || []) as Analytics[];
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Profile[];
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
}
