# CouponHub 🎟️

แพลตฟอร์มศูนย์รวมคูปองส่วนลด โค้ดเกม และโปรโมชั่นเด็ดที่ดีที่สุด อัปเดตใหม่ทุกวัน คัดลอกง่าย ใช้ได้จริง พัฒนาด้วย React, TypeScript, Tailwind CSS, TanStack Query และ Supabase

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **ระบบค้นหาและกรองคูปอง**: ค้นหาร้านค้า หมวดหมู่ หรือโค้ดส่วนลดได้อย่างรวดเร็ว พร้อมแท็กยอดนิยม
- **ระบบสมาชิกและการยืนยันตัวตน**: สมัครสมาชิก เข้าสู่ระบบ (รวมถึง Google OAuth) และกู้คืนรหัสผ่าน
- **แดชบอร์ดผู้ใช้งาน (User Dashboard)**:
  - จัดการคูปองที่บันทึกไว้ (Saved Coupons)
  - ติดตามร้านค้าโปรด (Favorite Stores)
  - ศูนย์แจ้งเตือน (Notifications)
  - แก้ไขโปรไฟล์และตั้งค่าบัญชี
- **แผงควบคุมผู้ดูแลระบบ (Admin Panel & CRUD)**:
  - **ภาพรวมและสถิติ (Analytics)**: กราฟแสดงสถิติผู้เข้าชม ยอดวิว และการใช้คูปองย้อนหลังด้วย Recharts
  - **จัดการคูปอง (Coupon CRUD)**: เพิ่ม แก้ไข และปิดการใช้งานคูปอง
  - **จัดการหมวดหมู่ (Category CRUD)**: จัดการหมวดหมู่พร้อมเลือกไอคอนและสี
  - **จัดการร้านค้า (Store CRUD)**: จัดการร้านค้าพาร์ทเนอร์และเรตติ้ง
  - **จัดการผู้ใช้งาน (User Management)**: ดูรายชื่อสมาชิกและสลับสิทธิ์การใช้งาน (Role: User / Admin)
  - **ตั้งค่าระบบ (Settings)**: ตั้งค่าเว็บไซต์และโหมดปิดปรับปรุง
- **รีวิวและความคิดเห็น**: ระบบแสดงความคิดเห็นและให้คะแนนร้านค้า
- **SEO & PWA**: รองรับ Meta Tags, Open Graph, และ Progressive Web App (Manifest)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts
- **State & Data Fetching**: TanStack React Query, React Router v7
- **Backend & Database**: Supabase (PostgreSQL, Auth, RPC Functions)

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
CouponHub-v1/
├── public/                 # ไฟล์ไอคอนและ Manifest สำหรับ PWA
├── src/
│   ├── components/         # คอมโพเนนต์ส่วนกลาง (Navbar, Footer, Modal, States ฯลฯ)
│   ├── contexts/           # Context Providers (Auth, Theme, Toast)
│   ├── lib/                # Supabase client และฟังก์ชันยูทิลิตี้
│   ├── pages/              # หน้าเว็บทั้งหมด (HomePage, StorePage, Dashboard, Admin ฯลฯ)
│   ├── services/           # บริการติดต่อฐานข้อมูล (couponService, userService)
│   ├── types/              # TypeScript Type Definitions
│   ├── App.tsx             # รูทคอมโพเนนต์และการตั้งค่า Routes
│   └── main.tsx            # จุดเริ่มต้นแอปพลิเคชัน
├── supabase/               # ฐานข้อมูล (Schema.sql และ Seed.sql)
└── package.json
```

---

## 🚀 การติดตั้งและรันโปรเจกต์ในเครื่อง (Getting Started)

1. **โคลนrepository**:
   ```bash
   git clone https://github.com/boy56ok/CouponHub-v1.git
   cd CouponHub-v1
   ```

2. **ติดตั้งแพ็กเกจ**:
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**:
   สร้างไฟล์ `.env` ที่ root directory แล้วใส่ค่า Supabase URL และ Anon Key ของคุณ:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **รัน Development Server**:
   ```bash
   npm run dev
   ```

5. ** Build สำหรับ Production**:
   ```bash
   npm run build
   ```

---

## 📄 ฐานข้อมูล (Database Schema)

รันสคริปต์ในโฟลเดอร์ `supabase/schema.sql` บน Supabase SQL Editor เพื่อสร้างตารางทั้งหมด พร้อมทั้งฟังก์ชัน `increment_coupon_usage` และระบบ Trigger สำหรับสร้าง Profile อัตโนมัติ

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
