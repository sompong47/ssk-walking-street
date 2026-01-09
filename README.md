# 🏪 ระบบจองล็อคตลาดถนนเดินศรีสะเกษ

ระบบจองล็อคแบบออนไลน์ที่ใช้ Next.js, React, TypeScript และ MongoDB พัฒนาด้วยเทคโนโลยีที่ทันสมัย

## 📋 สารบัญ

- [คุณสมบัติหลัก](#คุณสมบัติหลัก)
- [ข้อกำหนด](#ข้อกำหนด)
- [การติดตั้ง](#การติดตั้ง)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [วิธีใช้งาน](#วิธีใช้งาน)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## ✨ คุณสมบัติหลัก

- ✅ **Grid 3D Layout** - แสดงล็อคเป็นบล็อคสี่เหลี่ยม พร้อมสถานะสีต่างๆ
- ✅ **Real-time Booking** - จองล็อคได้ทันที มีการตรวจสอบความพร้อมของล็อค
- ✅ **Payment Management** - ระบบชำระเงินอัตโนมัติ รองรับหลายวิธีการ
- ✅ **Admin Dashboard** - ดูสถิติ, จัดการการจอง, ตรวจสอบการชำระเงิน
- ✅ **Data Validation** - ตรวจสอบข้อมูลทั้ง Client และ Server
- ✅ **Responsive Design** - ใช้ได้บนเดสก์ทอป, แท็บเล็ต, มือถือ
- ✅ **Database Indexing** - ปรับให้เร็วและประสิทธิภาพสูง
- ✅ **Error Handling** - จัดการข้อผิดพลาดอย่างเหมาะสม

---

## 📦 ข้อกำหนด

- Node.js 16.x หรือสูงกว่า
- npm 8.x หรือ yarn 3.x
- MongoDB Atlas Account (ฟรี)
- Internet connection

---

## 🚀 การติดตั้ง

### ขั้นตอนที่ 1: สร้าง MongoDB Atlas Database

1. ไปที่ https://www.mongodb.com/cloud/atlas
2. สมัครสมาชิกฟรี
3. สร้าง Project ใหม่
4. สร้าง Cluster แบบ Free Tier
5. สร้างผู้ใช้ (username/password)
6. ได้รับ Connection String

### ขั้นตอนที่ 2: Clone & Setup Project

```bash
# สร้างโปรเจค Next.js แบบ TypeScript
npx create-next-app@latest market-booking \
  --typescript \
  --tailwind=false \
  --eslint \
  --src-dir=false \
  --app=true

cd market-booking
```

### ขั้นตอนที่ 3: ติดตั้ง Dependencies

```bash
npm install mongoose dotenv bcryptjs jsonwebtoken
npm install --save-dev @types/mongoose @types/bcryptjs @types/jsonwebtoken
```

### ขั้นตอนที่ 4: สร้างโครงสร้างไฟล์

สร้างโฟลเดอร์และไฟล์ตามนี้:

```
market-booking/
├── app/
│   ├── api/
│   │   ├── lots/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── payments/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── stats/
│   │   │       └── route.ts
│   │   └── search/
│   │       └── route.ts
│   ├── booking/
│   │   └── page.tsx (Main page)
│   ├── admin/
│   │   └── page.tsx (Admin dashboard)
│   ├── page.tsx
│   └── layout.tsx
├── lib/
│   ├── mongodb.ts
│   ├── globals.d.ts
│   ├── types.ts
│   ├── models/
│   │   ├── Lot.ts
│   │   ├── Booking.ts
│   │   ├── Payment.ts
│   │   └── Admin.ts
│   └── utils/
│       ├── constants.ts
│       ├── validators.ts
│       └── helpers.ts
├── components/
│   ├── LotGrid.tsx
│   ├── BookingForm.tsx
│   └── Stats.tsx
├── .env.local
├── .gitignore
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### ขั้นตอนที่ 5: ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/market-booking?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### ขั้นตอนที่ 6: รัน Development Server

```bash
npm run dev
```

เปิด http://localhost:3000 ในเบราว์เซอร์

---

## 📁 โครงสร้างโปรเจค

```
market-booking/
│
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── booking/           # Main booking page
│   ├── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── lib/                   # Utility files
│   ├── mongodb.ts         # Database connection
│   ├── models/            # Mongoose models
│   ├── utils/             # Helper functions
│   └── types.ts           # TypeScript types
│
├── components/            # React components
│
├── .env.local            # Environment variables
├── next.config.js        # Next.js config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

---

## 💻 วิธีใช้งาน

### สำหรับผู้ค้า (User)

1. **เข้าเว็บไซต์** - ไปที่ http://localhost:3000
2. **ดูแบบวางแผน** - เห็นล็อคต่างๆ แสดงด้วยสี:
   - 🟢 **สีเขียว**: ว่าง (สามารถจองได้)
   - 🟡 **สีเหลือง**: จอง (รอการชำระเงิน)
   - 🔴 **สีแดง**: จองแล้ว (ชำระเงินเสร็จแล้ว)
3. **เลือกล็อค** - คลิกบล็อคสีเขียว
4. **กรอกข้อมูล**:
   - ชื่อผู้ค้า
   - เบอร์โทร (10 หลัก)
   - อีเมล
   - ประเภทสินค้า
   - วันเริ่ม-สิ้นสุด
5. **จองล็อค** - กดปุ่ม "จองล็อค"
6. **ชำระเงิน** - จะมีการชำระอัตโนมัติ
7. **สำเร็จ** - ล็อคจะกลายเป็นสีแดง

### สำหรับแอดมิน (Admin)

1. **เข้า Dashboard** - ไปที่ http://localhost:3000/admin
2. **ดูภาพรวม** - ดูจำนวนล็อค, จำนวนจอง, รายรับ
3. **จัดการการจอง** - ดูรายการจองทั้งหมด
4. **ตรวจสอบการชำระ** - ดูรายการชำระเงิน

---

## 📡 API Documentation

### Lots API

#### GET /api/lots
ดึงข้อมูลล็อคทั้งหมด

**Query Parameters:**
- `status` (optional): 'available' | 'booked' | 'reserved'
- `page` (default: 1)
- `limit` (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "lots": [...],
    "pagination": { "total": 94, "page": 1, "limit": 50, "pages": 2 }
  }
}
```

#### POST /api/lots
สร้างล็อคใหม่

**Body:**
```json
{
  "lotNumber": 1,
  "positionX": 0,
  "positionY": 0,
  "width": 2.4,
  "length": 3.5,
  "status": "available",
  "price": 500
}
```

#### GET /api/lots/[id]
ดึงข้อมูลล็อคเดียว

#### PATCH /api/lots/[id]
อัปเดตล็อค

#### DELETE /api/lots/[id]
ลบล็อค

---

### Bookings API

#### GET /api/bookings
ดึงข้อมูลการจองทั้งหมด

**Query Parameters:**
- `paymentStatus` (optional): 'pending' | 'completed' | 'cancelled'
- `page` (default: 1)
- `limit` (default: 20)

#### POST /api/bookings
สร้างการจองใหม่

**Body:**
```json
{
  "lotId": "507f1f77bcf86cd799439011",
  "vendorName": "สมชาย ใจดี",
  "vendorPhone": "0812345678",
  "vendorEmail": "somchai@email.com",
  "businessType": "เสื้อผ้า",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-02-15T00:00:00Z",
  "totalPrice": 500
}
```

#### GET /api/bookings/[id]
ดึงข้อมูลการจองเดียว

#### PATCH /api/bookings/[id]
อัปเดตการจอง

#### DELETE /api/bookings/[id]
ยกเลิกการจอง

---

### Payments API

#### GET /api/payments
ดึงข้อมูลการชำระเงิน

**Query Parameters:**
- `status` (optional): 'pending' | 'success' | 'failed'
- `page` (default: 1)
- `limit` (default: 20)

#### POST /api/payments
บันทึกการชำระเงิน

**Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "amount": 500,
  "paymentMethod": "cash",
  "status": "success",
  "transactionId": "TXN-1234567890"
}
```

---

### Dashboard API

#### GET /api/dashboard/stats
ดึงสถิติภาพรวม

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLots": 94,
    "availableLots": 45,
    "bookedLots": 35,
    "reservedLots": 14,
    "totalRevenue": 18500,
    "totalBookings": 49,
    "completedPayments": 35,
    "pendingPayments": 14,
    "recentBookings": [...]
  }
}
```

---

## 💾 Database Schema

### Lots Collection

```javascript
{
  _id: ObjectId,
  lotNumber: Number,           // 1-94
  positionX: Number,
  positionY: Number,
  width: Number,              // 2.4 meters
  length: Number,             // 3.5 meters
  status: String,             // available, booked, reserved
  vendor: String,             // ชื่อผู้ค้า
  vendorPhone: String,        // เบอร์โทร
  price: Number,              // ราคาต่อเดือน
  image: String,              // รูปภาพ
  notes: String,              // หมายเหตุ
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection

```javascript
{
  _id: ObjectId,
  lotId: ObjectId,            // Reference to Lot
  vendorName: String,
  vendorPhone: String,
  vendorEmail: String,
  businessType: String,       // ประเภทสินค้า
  businessDescription: String,
  startDate: Date,
  endDate: Date,
  paymentStatus: String,      // pending, completed, cancelled
  totalPrice: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection

```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,        // Reference to Booking
  amount: Number,
  paymentMethod: String,      // credit_card, bank_transfer, cash, qr_code
  transactionId: String,      // Unique transaction ID
  status: String,             // pending, success, failed
  paidDate: Date,
  bankName: String,
  accountName: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Deployment

### Deploy to Vercel (แนะนำ)

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Deploy
vercel
```

ตั้งค่า Environment Variables ใน Vercel Dashboard:
- `MONGODB_URI`
- `NEXT_PUBLIC_API_URL`

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy folder: .next
```

---

## 🔧 การปรับแต่ง

### เปลี่ยนจำนวนล็อค

ไปที่ `app/booking/page.tsx` แก้:
```javascript
for (let i = 1; i <= 94; i++) {  // เปลี่ยน 94 เป็นจำนวนที่ต้องการ
```

### เปลี่ยนราคา

ไปที่ `lib/utils/constants.ts`:
```javascript
DEFAULT_PRICE: 500,  // บาท/เดือน
```

### เปลี่ยนสี

ไปที่ `components` หรือ `pages` มี `colors` object:
```javascript
const colors = {
  primary: '#2c3e50',
  secondary: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  // ...
};
```

---

## 🐛 Troubleshooting

| ปัญหา | วิธีแก้ |
|------|--------|
| Cannot connect to MongoDB | ตรวจสอบ MONGODB_URI, เพิ่ม IP address ใน Atlas |
| Port 3000 ไม่ว่าง | `npm run dev -- -p 3001` |
| Module not found | `npm install` ใหม่ |
| Build error | `npm run type-check` และแก้ TypeScript errors |

---

## 📝 License

MIT License - ใช้ได้อย่างอิสระ

---

## 📞 Contact & Support

สำหรับปัญหาใด ๆ ติดต่อ:
- Email: maderxtv@market.com
- Phone: 

---

**ขนาดล็อค:** 2.4m × 3.5m  
**พื้นที่รวม:** ~450 เมตร  
**จำนวนล็อค:** 94 ล็อค (2 เลน)  
**ราคาเริ่มต้น:** 500 บาท/เดือน