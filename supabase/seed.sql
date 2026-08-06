-- Sample Categories
insert into public.categories (name, slug, icon, color, sort_order) values
('ช้อปปิ้ง', 'shopping', 'ShoppingBag', 'rose', 1),
('อาหาร', 'food', 'Utensils', 'amber', 2),
('เกม', 'games', 'Gamepad2', 'blue', 3),
('เติมเงิน', 'topup', 'WalletCards', 'cyan', 4),
('ท่องเที่ยว', 'travel', 'Plane', 'sky', 5),
('บัตรกำนัล', 'gift', 'Gift', 'pink', 6)
on conflict (slug) do nothing;

-- Sample Stores
insert into public.stores (name, slug, logo, logo_color, description, website, rating, is_featured) values
('Shopee', 'shopee', 'S', 'bg-[#f45126]', 'แอปช้อปปิ้งออนไลน์ยอดฮิตอันดับ 1 รวมดีลและโค้ดส่งฟรีเพียบ', 'https://shopee.co.th', 4.9, true),
('Lazada', 'lazada', 'L', 'bg-gradient-to-br from-[#2434e8] to-[#5665ff]', 'ช้อปสินค้ารາคาดี ดีลเด็ดทุกวัน คูปองส่วนลดสูงสุด 80%', 'https://lazada.co.th', 4.8, true),
('Grab', 'grab', 'G', 'bg-[#0ebc55]', 'เรียกรถ ส่งอาหาร และบริการจัดส่งพัสดุ อิ่มคุ้มทุกมื้อ', 'https://grab.com', 4.7, true),
('Free Fire', 'free-fire', '✦', 'bg-gradient-to-br from-[#38246f] to-[#f05b55]', 'โค้ดรับเพชรฟรี สกินปืน และไอเทมสุดพิเศษในเกม', 'https://ff.garena.com', 4.9, true),
('ROV', 'rov', '◈', 'bg-gradient-to-br from-[#172852] to-[#d56e4f]', 'เกม MOBA ยอดฮิต แจกโค้ดฮีโร่และสกินฟรีไม่อั้น', 'https://rov.in.th', 4.8, true),
('TrueMoney', 'truemoney', '✓', 'bg-white text-[#f04d28]', 'กระเป๋าเงินดิจิทัล รับเงินคืนและส่วนลดมากมาย', 'https://truemoney.com', 4.6, false)
on conflict (slug) do nothing;

-- Sample Coupons (linked via store_id and category_id)
-- Note: Replace store_id and category_id with actual UUIDs or run after stores/categories insert.
-- Sample Analytics Data
insert into public.analytics (date, visitors, new_users, coupons_used, page_views) values
(current_date - interval '6 days', 1240, 45, 310, 4500),
(current_date - interval '5 days', 1420, 52, 380, 5100),
(current_date - interval '4 days', 1590, 61, 420, 5800),
(current_date - interval '3 days', 1780, 75, 490, 6700),
(current_date - interval '2 days', 1950, 84, 550, 7400),
(current_date - interval '1 day', 2150, 95, 620, 8200),
(current_date, 2450, 110, 730, 9500)
on conflict (date) do nothing;
