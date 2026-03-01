# 🔐 Complete Environment Variables Setup Guide

## 📍 Where to Put Each File

```
culturalhatti/
├── .env.local                    ← Frontend (local dev only)
├── backend/
│   └── .env                      ← Backend (copy to AWS server)
└── admin/
    └── .env.local                ← Admin (copy to AWS server)
```

---

## 1️⃣ Frontend `.env.local` (Local Development Only)

**Location:** `/Users/harshdev/Documents/Projects/culturalhatti/.env.local`

**Content:**
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://3.7.122.146:3001/api

# Razorpay Public Key (safe to expose)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SM2JdyoM8GE1uw

# Firebase Configuration (Optional - only if you set it up)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-843249196918.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-843249196918
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-843249196918.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Note:** This file is for local testing only. On Vercel, you'll set these as environment variables in the dashboard.

---

## 2️⃣ Backend `.env` (AWS Server)

**Location on AWS:** `~/culturalhatti/backend/.env`

**Content:**
```env
# App Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://culturalhatti.com

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturalhatti
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRESQL_PASSWORD_HERE

# JWT Secrets (keep these secure)
JWT_SECRET=culturall-hatti-secret-key-2026
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=admin-cultural-hatti-secure-key-24x7

# Razorpay LIVE Keys
RAZORPAY_KEY_ID=rzp_live_SM2JdyoM8GE1uw
RAZORPAY_KEY_SECRET=sf0miRemTCjSSrdf2Eb5tJ67
RAZORPAY_WEBHOOK_SECRET=

# Email Configuration - Brevo (Sendinblue)
# Get credentials from: https://app.brevo.com/settings/keys/smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=YOUR_BREVO_EMAIL_HERE
SMTP_PASS=YOUR_BREVO_SMTP_PASSWORD_HERE
EMAIL_FROM=Cultural Hatti <noreply@culturalhatti.in>
ADMIN_EMAIL=harshdevsingh2004@gmail.com

# File Upload Settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**⚠️ IMPORTANT - Replace These:**
- `YOUR_POSTGRESQL_PASSWORD_HERE` - Your database password
- `YOUR_BREVO_EMAIL_HERE` - Your Brevo login email
- `YOUR_BREVO_SMTP_PASSWORD_HERE` - Your Brevo SMTP password (NOT API key)

**How to get Brevo SMTP credentials:**
1. Go to https://app.brevo.com/settings/keys/smtp
2. Click on "SMTP" tab (NOT "API Keys")
3. Copy your login email and SMTP password

---

## 3️⃣ Admin `.env.local` (AWS Server)

**Location on AWS:** `~/culturalhatti/admin/.env.local`

**Content:**
```env
# Backend API URL (localhost because admin runs on same server)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Note:** Admin uses `localhost` because it runs on the same AWS server as the backend.

---

## 🌐 Vercel Environment Variables

### How to Add:

1. Go to https://vercel.com/dashboard
2. Select your `culturalhatti` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below

### Variables to Add:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://3.7.122.146:3001/api` | Production, Preview, Development |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_SM2JdyoM8GE1uw` | Production, Preview, Development |

### Optional (Only if using Firebase):

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `project-843249196918.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `project-843249196918` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `project-843249196918.appspot.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID | Production, Preview, Development |

### After Adding Variables:
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**

---

## 🚀 Step-by-Step Setup on AWS Server

### Step 1: SSH into AWS
```bash
ssh ubuntu@3.7.122.146
# or
ssh ec2-user@3.7.122.146
```

### Step 2: Navigate to Project
```bash
cd ~/culturalhatti
```

### Step 3: Create Backend `.env`
```bash
cd ~/culturalhatti/backend
nano .env
```

**Paste the Backend `.env` content from above** (Section 2️⃣)

**Remember to replace:**
- Database password
- Brevo email
- Brevo SMTP password

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Create Admin `.env.local`
```bash
cd ~/culturalhatti/admin
nano .env.local
```

**Paste the Admin `.env.local` content from above** (Section 3️⃣)

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 5: Verify Files Exist
```bash
# Check backend .env
cat ~/culturalhatti/backend/.env

# Check admin .env.local
cat ~/culturalhatti/admin/.env.local
```

### Step 6: Restart Services
```bash
cd ~/culturalhatti
pm2 restart all
```

---

## ✅ Verification Checklist

### On AWS Server:
- [ ] `backend/.env` file exists and has all variables
- [ ] Database password is set in `backend/.env`
- [ ] Brevo SMTP credentials are set in `backend/.env`
- [ ] `admin/.env.local` file exists
- [ ] PM2 services are running: `pm2 status`

### On Vercel:
- [ ] `NEXT_PUBLIC_API_URL` is set to `http://3.7.122.146:3001/api`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set to `rzp_live_SM2JdyoM8GE1uw`
- [ ] Project is redeployed after adding variables

### Testing:
- [ ] Frontend loads: https://culturalhatti.com
- [ ] Backend health check: `curl http://3.7.122.146:3001/api/health`
- [ ] Admin loads: http://3.7.122.146:3002/admin/login
- [ ] Can add products to cart
- [ ] Razorpay payment opens
- [ ] Orders are created

---

## 🔒 Security Notes

### ✅ Safe to Expose (Public):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` (Razorpay Key ID)
- Firebase config (all `NEXT_PUBLIC_FIREBASE_*`)

### 🔴 NEVER Expose (Secret):
- `RAZORPAY_KEY_SECRET` (Razorpay Key Secret)
- `DB_PASSWORD`
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `SMTP_PASS`

### Files That Should NOT Be in Git:
- `backend/.env` ✅ Already in `.gitignore`
- `admin/.env.local` ✅ Already in `.gitignore`
- `.env.local` ✅ Already in `.gitignore`

---

## 🆘 Common Issues

### Issue: Backend can't connect to database
**Solution:** Check `DB_PASSWORD` in `backend/.env` matches your PostgreSQL password

### Issue: Email notifications not working
**Solution:** 
1. Go to https://app.brevo.com/settings/keys/smtp
2. Make sure you're using SMTP credentials (NOT API key)
3. Update `SMTP_USER` and `SMTP_PASS` in `backend/.env`

### Issue: Frontend can't connect to backend
**Solution:**
1. Check AWS firewall allows port 3001: `sudo ufw status`
2. Verify backend is running: `pm2 status`
3. Test: `curl http://3.7.122.146:3001/api/health`

### Issue: Razorpay not working
**Solution:** Verify both keys are correct:
- Frontend has Key ID: `rzp_live_SM2JdyoM8GE1uw`
- Backend has Key Secret: `sf0miRemTCjSSrdf2Eb5tJ67`

---

## 📝 Quick Reference

### View Environment Variables:
```bash
# Backend
cat ~/culturalhatti/backend/.env

# Admin
cat ~/culturalhatti/admin/.env.local
```

### Edit Environment Variables:
```bash
# Backend
nano ~/culturalhatti/backend/.env

# Admin
nano ~/culturalhatti/admin/.env.local
```

### After Changing `.env`:
```bash
pm2 restart all
```

---

## ✨ You're All Set!

Once you've set up all these files:
1. Backend will connect to database and send emails
2. Admin panel will work properly
3. Frontend will connect to your AWS backend
4. Payments will process through Razorpay
5. Everything will be in sync! 🎉
