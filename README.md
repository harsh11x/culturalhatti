# Cultural Hatti 🪔
## Mobile-First Brutalist Indian Cultural E-Commerce

Production-ready e-commerce platform with Razorpay payment integration, full admin control, and automated emails.

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Razorpay Account (test keys)
- Gmail App Password (for SMTP)

### 1. Configure Environment

```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your values:
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from your Razorpay dashboard
- `SMTP_USER` and `SMTP_PASS` (Gmail App Password)
- Strong `JWT_SECRET` and `ADMIN_JWT_SECRET`

Edit `frontend/.env.local`:
- Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your Razorpay test key ID

### 2. Install & Run (Development)

```bash
# Backend
cd backend
npm install
npm run dev            # Starts on port 3001 (auto-syncs DB)

# In another terminal – Seed the database
npm run seed           # Creates admin + sample data

# Frontend
cd frontend
npm run dev            # Starts on port 3000
```

### 3. Seed Data
After running `npm run seed`:
- **Admin Login**: `admin@culturalhatti.in` / `Admin@1234`
- 5 categories and 5 sample products created

### 4. Production (Frontend)

```bash
cd frontend
npm run build
npm start   # or deploy the .next/ output to your static host
```

The backend runs on AWS. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` (or as a GitHub Secret) to your AWS backend URL.

---

## Architecture

```
culturalhatti/
├── backend/              # Node.js + Express + Sequelize + PostgreSQL
│   └── src/
│       ├── config/       # DB, Razorpay, Mailer, Seed
│       ├── models/       # 9 Sequelize models
│       ├── middleware/   # JWT Auth, Admin Auth, Upload, Error Handler
│       ├── routes/       # Auth, Products, Categories, Orders, Payments, Users
│       └── services/     # payment.service.js, email.service.js
├── frontend/             # Next.js 14 App Router + TypeScript
│   └── src/
│       ├── app/          # All pages (public + admin)
│       ├── components/   # Navbar
│       ├── lib/          # Axios API client
│       ├── store/        # Zustand (cart + auth)
│       └── styles/       # Brutalist design system CSS
```

## Payment Flow (Strict - No COD)

1. User fills checkout address → clicks "Pay via Razorpay"
2. Backend creates Razorpay order → returns `razorpay_order_id`
3. Razorpay modal opens on frontend
4. User pays → frontend receives payment IDs
5. Frontend calls `POST /api/payments/verify` with HMAC signature
6. Backend verifies signature → deducts stock atomically → marks order `confirmed`
7. Confirmation email sent to customer + admin

Order remains `pending_payment` until backend verifies signature. **Stock is NEVER deducted before payment.**

## Admin Panel

URL: `http://localhost:3000/admin/login`

Features:
- 📊 Dashboard with revenue/orders analytics
- 📦 Orders: filter, search, status updates, shipment tracking, refunds
- 🏺 Products: add/edit/delete with image uploads
- 👥 Users: view, block, reset passwords

## Email Triggers (Automated)

| Event | Recipients |
|---|---|
| New order confirmed | Customer + Admin |
| Order shipped | Customer (with tracking ID) |
| Order cancelled | Customer |
| Refund initiated | Customer |

## Security

- JWT (user + separate admin tokens)  
- bcrypt password hashing  
- Razorpay HMAC signature verification  
- Webhook HMAC validation  
- Rate limiting (100 req/15min)  
- Helmet security headers  
- File type validation on uploads  
