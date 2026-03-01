# Cultural Hatti - E-Commerce Platform

## 🎯 System Architecture

- **Frontend:** Next.js (Vercel) - Customer website
- **Backend:** Express.js + PostgreSQL (AWS) - API server
- **Admin:** Next.js - Product & order management

---

## 🚀 Production Deployment

### Backend (AWS)

```bash
cd backend
npm install --production
node src/config/seed.js  # First time - creates admin account
pm2 start ecosystem.config.js
pm2 save
```

**Admin Credentials Created:**
- Email: admin@culturalhatti.in
- Password: Admin@1234

### Admin Panel

Update `admin/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

Deploy:
```bash
cd admin
npm run build
npm run start  # Port 3002
```

### Frontend (Vercel)

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

Deploy:
```bash
vercel --prod
```

---

## 📧 Email Notifications

Admin receives email for every order at: **harshdevsingh2004@gmail.com**

### Brevo Setup:

1. Login: https://app.brevo.com/
2. Go to: Settings → SMTP & API → **SMTP** tab
3. Get your SMTP credentials (Login + Master Password)
4. Update `backend/.env`:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email
SMTP_PASS=your-smtp-master-password
ADMIN_EMAIL=harshdevsingh2004@gmail.com
```

**Note:** Use SMTP credentials from SMTP tab, NOT the API key.

---

## 🔧 Environment Variables

### Backend `.env`

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app

# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_NAME=culturalhatti
DB_USER=admin
DB_PASSWORD=strong-password

# JWT
JWT_SECRET=long-random-secret
ADMIN_JWT_SECRET=different-admin-secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=webhook-secret

# Email
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-smtp-password
ADMIN_EMAIL=harshdevsingh2004@gmail.com
```

---

## 🎯 Admin Features

### Product Management
- Create/edit products with images
- Manage stock and pricing
- Set featured products

### Order Management
- View all orders with customer details
- Customer info: name, email, phone, address
- Update order status
- Add tracking information
- Process refunds

### Email Notifications
- Admin receives email for new orders
- Customers receive confirmations
- Customers receive shipping updates

---

## 📚 Key Files

```
backend/
├── src/server.js           - Main server
├── src/config/seed.js      - Create admin account
├── .env                    - Configuration

admin/
├── src/                    - Admin panel source
├── .env.local             - Admin configuration

frontend/
├── src/                    - Frontend source
├── .env.local             - Frontend configuration

ecosystem.config.js         - PM2 configuration
PRODUCTION_SETUP.md        - Detailed production guide
```

---

## 🔐 Security

- Change default admin password after first login
- Use strong JWT secrets in production
- Enable HTTPS on all domains
- Set up database backups
- Use AWS Secrets Manager for sensitive data

---

## 📞 Support

**Admin Panel:** Login at your-admin-domain.com/admin/login
**Brevo Dashboard:** https://app.brevo.com/
**Razorpay Dashboard:** https://dashboard.razorpay.com/

---

**Last Updated:** March 1, 2026
