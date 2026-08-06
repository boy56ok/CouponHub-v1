-- Enable UUID extension
create extension if not extension "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  icon text default 'Tag',
  color text default 'pink',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stores table
create table if not exists public.stores (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  logo text not null,
  logo_color text default 'bg-[#f45126]',
  description text,
  banner_color text default 'from-[#140d39] to-[#22052f]',
  website text,
  rating numeric(2,1) default 4.8,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coupons table
create table if not exists public.coupons (
  id uuid default uuid_generate_v4() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text not null,
  code text not null,
  discount_type text default 'fixed' check (discount_type in ('fixed', 'percent', 'free_shipping', 'gift')),
  discount_value text not null,
  expires_at date not null,
  is_featured boolean default false,
  is_active boolean default true,
  usage_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favorites table
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  coupon_id uuid references public.coupons(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, coupon_id)
);

-- Store Favorites table
create table if not exists public.store_favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  store_id uuid references public.stores(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, store_id)
);

-- Notifications table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info' check (type in ('info', 'success', 'warning', 'coupon')),
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments table
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  rating int default 5 check (rating between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics table
create table if not exists public.analytics (
  id uuid default uuid_generate_v4() primary key,
  date date unique not null,
  visitors int default 0,
  new_users int default 0,
  coupons_used int default 0,
  page_views int default 0
);

-- Function to increment coupon usage
create or replace function increment_coupon_usage(coupon_uuid uuid)
returns void as $$
begin
  update public.coupons
  set usage_count = usage_count + 1
  where id = coupon_uuid;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;

create or drop trigger if exists on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
