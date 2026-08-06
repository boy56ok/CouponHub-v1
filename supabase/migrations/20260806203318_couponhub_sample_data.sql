/*
# CouponHub - Sample Data

Populates categories, stores, coupons, and analytics with realistic sample data
so the application has content on first load. Uses ON CONFLICT to be idempotent.
*/

-- ============ CATEGORIES ============
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('ช้อปปิ้ง', 'shopping', 'ShoppingBag', 'rose', 1),
  ('อาหาร', 'food', 'Utensils', 'amber', 2),
  ('เกม', 'games', 'Gamepad2', 'blue', 3),
  ('เติมเงิน', 'topup', 'WalletCards', 'cyan', 4),
  ('ท่องเที่ยว', 'travel', 'Plane', 'sky', 5),
  ('บัตรกำนัล', 'voucher', 'Gift', 'pink', 6),
  ('แอป & บริการ', 'services', 'Grid2X2', 'teal', 7),
  ('อื่นๆ', 'other', 'MoreHorizontal', 'slate', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============ STORES ============
INSERT INTO stores (name, slug, logo, logo_color, description, banner_color, website, rating, is_featured) VALUES
  ('Shopee', 'shopee', 'S', '#f45126', 'ตลาดออนไลน์อันดับ 1 ของไทย ช้อปสินค้าทุกหมวดในราคาถูก', '#1a0a2e', 'shopee.co.th', 4.8, true),
  ('Lazada', 'lazada', 'L', '#2434e8', 'แพลตฟอร์มช้อปออนไลน์ที่มีสินค้าหลากหลาย ส่งฟรีทั่วประเทศ', '#0d1a4d', 'lazada.co.th', 4.6, true),
  ('Grab', 'grab', 'G', '#0ebc55', 'แอปเรียกรถและส่งอาหารชั้นนำ บริการครอบคลุมทั่วเอเชีย', '#0a2e1a', 'grab.com', 4.5, true),
  ('Foodpanda', 'foodpanda', '●', '#f73e93', 'ส่งอาหารถึงบ้าน ร้านเด็ดทั่วเมือง สั่งง่ายไว้ใจได้', '#2e0a1a', 'foodpanda.co.th', 4.3, false),
  ('Free Fire', 'free-fire', '✦', '#38246f', 'เกมแบทเทิลรอยัลอันดับ 1 บนมือถือ เล่นฟรี สนุกไร้ขีดจำกัด', '#1a0a2e', 'garena.com', 4.7, true),
  ('ROV', 'rov', '◈', '#172852', 'เกม MOBA ยอดนิยม สนุกไปกับการต่อสู้ 5v5', '#0d1a3d', 'rov.garena.com', 4.5, false),
  ('PUBG Mobile', 'pubg-mobile', '●', '#1e3d64', 'เกมแบทเทิลรอยัลที่ผู้เล่นทั่วโลกหลงรัก แข่งขันเป็นคนสุดท้าย', '#0d1a2e', 'pubgmobile.com', 4.6, true),
  ('TrueMoney', 'true-money', '✓', '#f04d28', 'กระเป๋าเงินอิเล็กทรอนิกส์ โอน จ่าย เติมเงิน ได้ทุกธุรกรรม', '#2e1a0a', 'truemoney.com', 4.4, false),
  ('Klook', 'klook', 'K', '#ff5733', 'จองท่องเที่ยว กิจกรรม และประสบการณ์ทั่วโลกในราคาถูก', '#1a0a2e', 'klook.com', 4.5, false),
  ('Agoda', 'agoda', 'A', '#5392f9', 'จองโรงแรมและที่พักราคาถูกที่สุด พร้อมส่วนลดพิเศษ', '#0d1a3d', 'agoda.com', 4.4, false)
ON CONFLICT (slug) DO NOTHING;

-- ============ COUPONS ============
-- We need to reference store and category IDs. Use subqueries.
INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 200 บาท ขั้นต่ำ 999', 'ลด 200 บาท ขั้นต่ำ 999 บาท สำหรับสินค้าทุกหมวด', 'SHOPEE200', 'fixed', '200', '2026-12-31', true, true, 12345
FROM stores s, categories c WHERE s.slug = 'shopee' AND c.slug = 'shopping'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 150 บาท ขั้นต่ำ 899', 'ลด 150 บาท ขั้นต่ำ 899 บาท สินค้าทุกชิ้น', 'LAZADA150', 'fixed', '150', '2026-12-30', true, true, 10234
FROM stores s, categories c WHERE s.slug = 'lazada' AND c.slug = 'shopping'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 50 บาท ทุกเมนู', 'ลด 50 บาท สำหรับการสั่งอาหารทุกเมนู', 'GRAB50', 'fixed', '50', '2026-12-28', false, true, 8234
FROM stores s, categories c WHERE s.slug = 'grab' AND c.slug = 'food'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 60 บาท ขั้นต่ำ 300', 'ลด 60 บาท ขั้นต่ำ 300 บาท สั่งอาหารออนไลน์', 'FP60', 'fixed', '60', '2026-12-29', false, true, 6123
FROM stores s, categories c WHERE s.slug = 'foodpanda' AND c.slug = 'food'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'โค้ดรับเพชรฟรี 100 เพชร', 'รับเพชรฟรี 100 เพชร สำหรับผู้เล่น Free Fire', 'FF100DIAMOND', 'gift', '100 เพชร', '2026-12-31', true, true, 21345
FROM stores s, categories c WHERE s.slug = 'free-fire' AND c.slug = 'games'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'สกินฟรี! ทุกตู้ไม่จำกัด', 'รับสกินฟรี ไม่จำกัดจำนวน สำหรับผู้เล่น ROV', 'ROVFREECODE', 'gift', 'สกินฟรี', '2026-12-31', false, true, 9876
FROM stores s, categories c WHERE s.slug = 'rov' AND c.slug = 'games'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด UC สูงสุด 25%', 'ส่วนลด UC สูงสุด 25% สำหรับ PUBG Mobile', 'PUBG25OFF', 'percent', '25%', '2026-12-31', false, true, 7654
FROM stores s, categories c WHERE s.slug = 'pubg-mobile' AND c.slug = 'games'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'รับเงินคืน 20 บาท', 'รับเงินคืน 20 บาท เมื่อเติมเงินผ่าน TrueMoney', 'TRUE20', 'fixed', '20', '2026-12-27', false, true, 5432
FROM stores s, categories c WHERE s.slug = 'true-money' AND c.slug = 'topup'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 10% การจองท่องเที่ยว', 'ส่วนลด 10% สำหรับการจองกิจกรรมท่องเที่ยวทั่วโลก', 'KLOOK10', 'percent', '10%', '2026-12-31', true, true, 4567
FROM stores s, categories c WHERE s.slug = 'klook' AND c.slug = 'travel'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 500 บาท จองโรงแรม', 'ลด 500 บาท สำหรับการจองโรงแรมทั่วโลก', 'AGODA500', 'fixed', '500', '2026-12-31', false, true, 3210
FROM stores s, categories c WHERE s.slug = 'agoda' AND c.slug = 'travel'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ส่งฟรี ไม่จำกัด', 'ฟรีค่าจัดส่ง ไม่จำกัดยอดสั่งซื้อ', 'SHOPEEFREESHIP', 'free_shipping', 'ฟรี', '2026-12-31', true, true, 15678
FROM stores s, categories c WHERE s.slug = 'shopee' AND c.slug = 'shopping'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (store_id, category_id, title, description, code, discount_type, discount_value, expires_at, is_featured, is_active, usage_count)
SELECT s.id, c.id, 'ลด 15% วันเกิด', 'ส่วนลดพิเศษ 15% สำหรับสมาชิกวันเกิด', 'LAZADABDAY15', 'percent', '15%', '2026-12-31', false, true, 3456
FROM stores s, categories c WHERE s.slug = 'lazada' AND c.slug = 'shopping'
ON CONFLICT DO NOTHING;

-- ============ ANALYTICS (last 7 days) ============
INSERT INTO analytics (date, visitors, new_users, coupons_used, page_views) VALUES
  (CURRENT_DATE - 6, 3420, 128, 856, 12400),
  (CURRENT_DATE - 5, 3850, 145, 923, 13800),
  (CURRENT_DATE - 4, 4100, 167, 1024, 15200),
  (CURRENT_DATE - 3, 3950, 134, 890, 14100),
  (CURRENT_DATE - 2, 4520, 189, 1156, 16800),
  (CURRENT_DATE - 1, 4830, 201, 1287, 18200),
  (CURRENT_DATE, 5210, 234, 1402, 19500)
ON CONFLICT (date) DO NOTHING;
