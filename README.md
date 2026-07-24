# 🛠️ Icon Repair System (ระบบแจ้งซ่อมและจัดการงานซ่อมไอที)

![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql)

**Icon Repair System** คือระบบบริหารจัดการงานซ่อมคอมพิวเตอร์ โน้ตบุ๊ก ปริ้นเตอร์ และอุปกรณ์ไอทีแบบครบวงจร ออกแบบมาเพื่อเพิ่มประสิทธิภาพการทำงานของร้านหรือศูนย์บริการซ่อมไอที รองรับการทำงานร่วมกันระหว่างผู้ดูแลระบบ (Admin), ช่างเทคนิค (Technician) และให้บริการติดตามสถานะงานซ่อมสำหรับลูกค้า (Public Tracking) ผ่านหน้าเว็บ

---

## 📌 คุณสมบัติเด่นของระบบ (Key Features)

### 1. 🔍 ระบบติดตามสถานะงานซ่อมสำหรับลูกค้า (Public Track System)
- ติดตามสถานะงานซ่อมได้ทันทีโดยไม่ต้องเข้าสู่ระบบ (Guest Mode)
- ค้นหาได้ง่ายผ่าน **หมายเลขตั๋ว (Ticket Number)** หรือ **เบอร์โทรศัพท์ลูกค้า**
- แสดงรายละเอียดอุปกรณ์ อาการเสีย วันที่รับเครื่อง สถานะปัจจุบัน และประมาณการค่าบริการ

### 2. 👑 ระบบผู้ดูแลระบบ (Admin Portal)
- **Dashboard & Analytics**: แสดงสรุปผลสถิติงานซ่อม ยอดรายได้แยกตามประเภท และสถานะงานซ่อมในรูปแบบกราฟ (Recharts)
- **ระบบจัดการตั๋วงานซ่อม (Repair Tickets Management)**: 
  - ออกใบรับซ่อม (Ticket) ใหม่ พร้อมลงทะเบียนข้อมูลลูกค้า
  - มอบหมายงานซ่อมให้กับช่างเทคนิครายบุคคล
  - พิมพ์ใบรับซ่อม (Print Repair Receipt) รูปแบบมาตรฐานสำหรับมอบให้ลูกค้า
- **ระบบจัดการผู้ใช้งาน (User Management)**:
  - เพิ่ม/แก้ไข/ระงับ บัญชีผู้ใช้งานระบบ (Admin & Technician)
  - รองรับการกำหนดวันหมดอายุของบัญชี (Expires At) สำหรับสิทธิ์ใช้งานชั่วคราว
- **ระบบจัดการข้อมูลลูกค้า (Customer Management)**: บันทึกประวัติและค้นหาข้อมูลลูกค้าย้อนหลัง

### 3. 🔧 ระบบสำหรับช่างเทคนิค (Technician Portal)
- แสดงรายการงานซ่อมเฉพาะที่ได้รับมอบหมาย
- บันทึกผลการตรวจเช็ก/วินิจฉัยอาการเสีย (Diagnosis)
- อัปเดตสถานะงานซ่อมตามลำดับขั้นตอน: `รับเครื่อง` ➔ `กำลังตรวจสอบ` ➔ `รออะไหล่` ➔ `กำลังซ่อม` ➔ `ซ่อมเสร็จ` ➔ `ส่งมอบแล้ว` / `ยกเลิก`
- บันทึกค่าอะไหล่ (Parts Cost) และค่าบริการ (Service Cost) คำนวณราคารวมอัตโนมัติ

### 4. 🛡️ ความปลอดภัยและระบบ Admin ชั่วคราว (Security & Temp Admin Setup)
- **Role-Based Access Control (RBAC)** แยกสิทธิ์ Admin และ Technician ผ่าน NextAuth.js และ Middleware
- **Deployment Security Script**: สคริปต์สร้างบัญชี Admin ชั่วคราว (อายุ 24 ชั่วโมง) สำหรับการติดตั้งระบบครั้งแรก (Onboarding) โดยจะระงับการสร้างซ้ำหากมี Admin หลักในระบบแล้ว

---

## 🏗️ เทคโนโลยีและ Framework ที่ใช้ (Tech Stack)

### Frontend & Server-Side Framework
- **[Next.js 16 (App Router)](https://nextjs.org/)**: Framework สำหรับสร้าง Web Application แบบ Full-Stack ทำงานรวดเร็วด้วย Server Components และ Server Actions
- **[React 19](https://react.dev/)**: UI Library เวอร์ชันล่าสุด
- **[TypeScript](https://www.typescriptlang.org/)**: เพิ่ม Typing Safety ลดข้อผิดพลาดในการพัฒนา

### Styling & UI Components
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework สำหรับตกแต่ง UI ในสไตล์ Modern Green Theme
- **[Recharts](https://recharts.org/)**: Library สำหรับแสดงผล Dashboard Visualizations และ Chart สถิติ
- **[SweetAlert2](https://sweetalert2.github.io/)**: ระบบแจ้งเตือน Popup Modal ที่สวยงาม ตอบสนองการใช้งานราบรื่น

### Database & Authentication
- **[PostgreSQL](https://www.postgresql.org/)**: ระบบฐานข้อมูลเชิงสัมพันธ์ที่มีประสิทธิภาพสูง
- **[Prisma ORM 6](https://www.prisma.io/)**: Database ORM สำหรับจัดการ Data Model และ Query ฐานข้อมูล
- **[NextAuth.js v5 (Auth.js)](https://authjs.dev/)**: ระบบรักษาความปลอดภัย Authenticate ด้วย Credentials & Session Token
- **[BcryptJS](https://github.com/dcodeIO/bcrypt.js)**: สำหรับเข้ารหัสผ่าน (Password Hashing)

---

## 💻 สิ่งที่ต้องเตรียมก่อนเริ่มใช้งาน (Prerequisites)

1. **Node.js**: เวอร์ชัน `v18.17.0` ขึ้นไป (แนะนำ `v20.x LTS`)
2. **PostgreSQL Database Server**: ติดตั้งในเครื่อง local หรือใช้ Cloud PostgreSQL Database (เช่น Supabase, Neon, ElephantSQL)
3. **Git**: สำหรับจัดการ Source Code

---

## 🚀 ขั้นตอนการติดตั้งและตั้งค่าระบบ (Setup & Installation)

### Step 1: Clone Repository
```bash
git clone https://github.com/10VE48TKU-KaCha/Icon.git
cd Icon
```

### Step 2: ติดตั้ง Dependencies
```bash
npm install
```

### Step 3: ตั้งค่า Environment Variables (`.env`)
คัดลอกไฟล์ หรือสร้างไฟล์ `.env` ใน Root Directory ของโปรเจกต์:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/icon_repair?schema=public"

# NextAuth Configuration
AUTH_SECRET="your-32-character-random-secret-key-here"
AUTH_URL="http://localhost:3000"
```
> 💡 *ข้อแนะนำ: เปลี่ยน `USERNAME`, `PASSWORD` และ `icon_repair` ให้ตรงกับ PostgreSQL ในเครื่องของคุณ*

### Step 4: Setup Database & Prisma Schema
สร้าง Table ใน PostgreSQL ตาม Prisma Schema:

```bash
# Push Schema ไปยังฐานข้อมูล
npm run db:push

# Generate Prisma Client
npm run db:generate
```

*(ตัวเลือกเสริม)* หากต้องการใส่ข้อมูลตัวอย่างสำหรับทดสอบ:
```bash
npm run db:seed
```

### Step 5: สร้างบัญชี Admin ชั่วคราวสำหรับเริ่มใช้งานครั้งแรก
รันสคริปต์สร้างบัญชี Admin ชั่วคราว (มีอายุการใช้งาน 24 ชั่วโมง):

```bash
npm run setup:admin
```
เมื่อรันสำเร็จ ระบบจะแสดง `Username` (เช่น `setup_admin`) และ `Password` สุ่มขึ้นมาบนหน้าจอ Terminal ให้คัดลอกไว้เพื่อนำไปล็อกอินสร้างบัญชี Admin หลักในระบบ

### Step 6: เปิดใช้งาน Development Server
```bash
npm run dev
```
เปิดบราวเซอร์และเข้าใช้งานได้ที่ [http://localhost:3000](http://localhost:3000)

---

## 📜 รายการคำสั่งทั้งหมดในระบบ (Available Scripts)

| คำสั่ง (Command) | คำอธิบาย (Description) |
| :--- | :--- |
| `npm run dev` | เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา (Development Server) ที่ port 3000 |
| `npm run build` | บิลด์โปรเจกต์สำหรับใช้งานจริง (Production Build) |
| `npm run start` | รันเซิร์ฟเวอร์แบบ Production หลังทำการ build เรียบร้อย |
| `npm run lint` | ตรวจสอบคุณภาพโค้ดด้วย ESLint |
| `npm run db:push` | อัปเดต Schema ใน PostgreSQL ให้ตรงกับ `prisma/schema.prisma` |
| `npm run db:generate` | อัปเดต Prisma Client ให้ตรงกับ Data Model |
| `npm run db:seed` | นำเข้าข้อมูลตัวอย่างเริ่มต้นลงในฐานข้อมูล |
| `npm run db:studio` | เปิด Prisma Studio GUI ในบราวเซอร์เพื่อจัดการข้อมูลตรงผ่านเว็บ |
| `npm run setup:admin` | สร้างบัญชีผู้ดูแลระบบชั่วคราว (24 ชั่วโมง) สำหรับการ Setup ระบบครั้งแรก |

---

## 📖 คู่มือการใช้งานระบบ (User Guide)

```mermaid
flowchart TD
    A[ลูกค้ามาส่งซ่อม] --> B[Admin ลงทะเบียน & ออกตั๋วรับซ่อม]
    B --> C[Admin พิมพ์ใบรับซ่อมให้ลูกค้า]
    B --> D[Admin มอบหมายงานให้ช่าง]
    D --> E[ช่างตรวจเช็ก & อัปเดตสถานะ/ค่าบริการ]
    E --> F[ซ่อมเสร็จ / COMPLETED]
    F --> G[ลูกค้าตรวจสอบสถานะผ่านเว็บด้วย Ticket/Phone]
    G --> H[ลูกค้ามารับเครื่อง & ชำระเงิน]
```

### 1. สำหรับลูกค้าทั่วไป (Customer)
1. เข้าไปที่หน้าแรกของเว็บไซต์ (`/`)
2. กรอก **หมายเลขใบรับซ่อม (Ticket Number)** เช่น `TK-XXXXXXXX` หรือ **เบอร์โทรศัพท์** ที่แจ้งไว้
3. กดปุ่ม **ค้นหา** เพื่อดูสถานะล่าสุด ช่างผู้รับผิดชอบ รายละเอียดอาการเสีย และประมาณการค่าใช้จ่าย

### 2. สำหรับผู้ดูแลระบบ (Admin)
1. เข้าสู่ระบบทางหน้าล็อกอิน (`/login`)
2. **ออกใบรับซ่อมใหม่**:
   - ไปที่เมนู **ออกใบรับซ่อม** ➔ กรอกข้อมูลลูกค้า และรายละเอียดอุปกรณ์ (PC, Notebook, Printer, ฯลฯ)
   - เลือกช่างเทคนิคที่จะให้รับผิดชอบงาน
   - กดบันทึกเพื่อสร้างตั๋ว และกด **พิมพ์ใบรับซ่อม** เพื่อออกเอกสารให้ลูกค้า
3. **จัดการงานซ่อม**:
   - ตรวจดูรายการงานซ่อมทั้งหมด เปลี่ยนตัวช่าง แก้ไขรายละเอียด หรืออัปเดตราคาบริการ
4. **จัดการผู้ใช้งาน**:
   - เพิ่มบัญชีช่างเทคนิคใหม่ หรือ Admin คนใหม่ ในเมนู **จัดการผู้ใช้งาน**
   - สามารถระงับการใช้งานหรือลบบัญชีผู้ใช้ได้

### 3. สำหรับช่างเทคนิค (Technician)
1. เข้าสู่ระบบด้วยบัญชีช่าง (`/login`)
2. เข้าไปที่หน้า **แดชบอร์ดช่าง** (`/technician`) เพื่อดูรายการงานซ่อมที่ตนเองได้รับมอบหมาย
3. คลิกเลือกงานเพื่อ:
   - บันทึกข้อความวินิจฉัย/สาเหตุที่พบ (Diagnosis)
   - บันทึกค่าอะไหล่ (Parts Cost) และค่าบริการ (Service Cost)
   - เปลี่ยนสถานะงานซ่อม เช่น เปลี่ยนเป็น `WAITING_PARTS` เมื่อรออะไหล่ หรือ `COMPLETED` เมื่อซ่อมเสร็จสมบูรณ์

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
Icon/
├── prisma/
│   ├── schema.prisma         # Prisma Data Model (User, Customer, RepairJob, Setting)
│   └── seed.ts               # Seed data สำหรับทดสอบระบบ
├── public/                   # Static Asset (รูปภาพ, โลโก้, favicon)
├── scripts/
│   ├── setup-temp-admin.ts   # สคริปต์ความปลอดภัยสร้าง Admin ชั่วคราว
│   └── test_db.ts            # สคริปต์ทดสอบการเชื่อมต่อฐานข้อมูล
├── src/
│   ├── app/
│   │   ├── admin/            # หน้าสำหรับ Admin (Dashboard, Jobs, Users, Customers)
│   │   ├── api/              # API Routes (Auth, Jobs, Users, Track, Reports)
│   │   ├── login/            # หน้าเข้าสู่ระบบ (Sign In)
│   │   ├── technician/       # หน้าสำหรับช่างเทคนิค (Technician Portal)
│   │   ├── track/            # หน้าค้นหาและติดตามสถานะงานซ่อม
│   │   ├── globals.css       # Global Styles & Modern Green Theme Configuration
│   │   ├── layout.tsx        # Root Layout & Session Provider
│   │   └── page.tsx          # Landing Page & Public Track Component
│   ├── components/           # UI Components (Providers, RepairReceipt, Layouts)
│   ├── lib/                  # Helper Utilities (Auth, Prisma Client, Utils)
│   ├── middleware.ts         # Authentication & Route Protection Middleware
│   └── types/                # TypeScript Interface & Type Definitions
├── .env                      # Environment Variables Config
├── next.config.ts            # Next.js Configuration
├── package.json              # Dependencies and Script definition
└── README.md                 # เอกสารอธิบายระบบ (คู่มือฉบับนี้)
```

---

## 🔒 การนำไปใช้งานจริง (Production Deployment)

1. **ตั้งค่า `AUTH_SECRET`**: ต้องเปลี่ยนค่า `AUTH_SECRET` ใน `.env` ให้เป็น String สุ่มอย่างน้อย 32 ตัวอักษร
2. **Database Migration**: ก่อนรันบน Production แนะนำให้ใช้ `npx prisma migrate deploy` แทน `db:push`
3. **ลบบัญชี Setup Admin**: เมื่อสร้าง Admin หลักครบแล้ว ระบบจะลบบัญชีชั่วคราวให้อัตโนมัติเมื่อหมดอายุ (24 ชั่วโมง)

---

## 📄 License & Contact

พัฒนาและดูแลระบบโดย **Icon Multimedia**  
Repository: [https://github.com/10VE48TKU-KaCha/Icon.git](https://github.com/10VE48TKU-KaCha/Icon.git)
