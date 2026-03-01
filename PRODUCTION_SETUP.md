# Cultural Hatti - Production Setup Guide

## 🚀 Quick Production Checklist

### Backend (AWS)

1. **Environment Variables** - Set in your AWS instance:

```bash
# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Database (AWS RDS)
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_NAME=culturalhatti
DB_USER=admin
DB_PASSWORD=your-strong-password

# JWT Secrets
JWT_SECRET=your-very-long-random-secret-key
ADMIN_JWT_SECRET=your-different-admin-secret-key

# Razorpay LIVE Keys
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-live-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Email - Brevo
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email@example.com
SMTP_PASS=your-brevo-smtp-password
EMAIL_FROM=Cultural Hatti <noreply@culturalhatti.in>
ADMIN_EMAIL=harshdevsingh2004@gmail.com
```

2. **Deploy Backend:**

```bash
# On AWS instance
cd backend
npm install --production
node src/config/seed.js  # First time only - creates admin
pm2 start src/server.js --name culturalhatti-backend
pm2 save
pm2 startup
```

3. **Verify Backend:**

```bash
curl https://your-backend-domain.com/api/health
```

---

### Admin Panel

**Option A: Deploy on Vercel/Netlify**

Update `admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

Deploy:
```bash
cd admin
npm run build
vercel --prod
```

**Option B: Deploy on AWS with Backend**

```bash
cd admin
npm run build
pm2 start npm --name culturalhatti-admin -- start
```

---

### Frontend (Vercel)

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

Deploy:
```bash
cd frontend
vercel --prod
```

---

## 📧 Brevo Email Setup

### Get SMTP Credentials:

1. Login: https://app.brevo.com/
2. Go to: **Settings** → **SMTP & API** → **SMTP** tab
3. Copy:
   - **Login** (your email) → Use as `SMTP_USER`
   - **Master Password** → Use as `SMTP_PASS`

### Update Backend `.env`:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email
SMTP_PASS=your-smtp-master-password
ADMIN_EMAIL=harshdevsingh2004@gmail.com
```

**Note:** Use SMTP credentials (from SMTP tab), NOT API key (from API tab)

---

## 🔐 Security Checklist

- [ ] Change default admin password (admin@culturalhatti.in / Admin@1234)
- [ ] Use strong JWT secrets (not the default ones)
- [ ] Use Razorpay LIVE keys (not test keys)
- [ ] Enable HTTPS on all domains
- [ ] Set up database backups
- [ ] Configure CORS with production URLs
- [ ] Don't commit `.env` files
- [ ] Use AWS Secrets Manager for sensitive data

---

## 🎯 Admin Access

**Admin Panel URL:** https://your-admin-domain.com/admin/login

**Default Credentials:**
- Email: admin@culturalhatti.in
- Password: Admin@1234

**⚠️ Change password immediately after first login!**

---

## 📊 What Happens in Production

### Customer Places Order:
1. Payment processed via Razorpay (LIVE mode)
2. Order saved to database
3. **Email sent to: harshdevsingh2004@gmail.com** with:
   - Customer name, email, phone
   - Shipping address
   - Order items and total
   - Payment ID
4. Customer receives confirmation email

### Admin Processes Order:
1. Login to admin panel
2. View order with all customer details
3. Update status to "Processing"
4. Add tracking ID and courier
5. Customer receives shipping email automatically

---

## 🚀 Start Production Services

### Using PM2 (Recommended):

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
pm2 logs
```

### Manual Start:

```bash
# Backend
cd backend
NODE_ENV=production node src/server.js

# Admin (if on same server)
cd admin
npm run build
npm run start
```

---

## 📞 Important URLs

| Service | URL |
|---------|-----|
| Backend API | https://your-backend-domain.com/api |
| Admin Panel | https://your-admin-domain.com/admin/login |
| Frontend | https://your-frontend-domain.vercel.app |
| Brevo Dashboard | https://app.brevo.com/ |
| Razorpay Dashboard | https://dashboard.razorpay.com/ |

---

## ✅ Production Checklist

Before going live:

- [ ] All products added with images
- [ ] Admin account created (run seed script)
- [ ] Brevo SMTP configured and tested
- [ ] Razorpay LIVE keys configured
- [ ] Database backed up
- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] CORS configured with production URLs
- [ ] PM2 running and saved
- [ ] Default admin password changed
- [ ] All policy pages reviewed

---

## 🎊 You're Ready for Production!

Your system will:
- ✅ Accept real orders
- ✅ Process real payments
- ✅ Send you email notifications
- ✅ Send customer confirmations
- ✅ Handle tracking and shipping
- ✅ Process refunds

**Admin email:** harshdevsingh2004@gmail.com will receive all order notifications.

---

**Last Updated:** March 1, 2026
