# 🚀 Quick Production Setup Guide

## ✅ What's Already Configured

### Local Files Updated:
1. ✅ `backend/.env` - FRONTEND_URL set to https://culturalhatti.com
2. ✅ `.env.local` (root) - API URL set to http://3.7.122.146:3001/api
3. ✅ `.env.local` (root) - Razorpay LIVE key added
4. ✅ All files committed and pushed to GitHub

### Infrastructure:
- **Frontend**: https://culturalhatti.com (Vercel)
- **Backend**: http://3.7.122.146:3001 (AWS)
- **Admin**: http://3.7.122.146:3002 (AWS)

---

## 🔧 What You Need to Do on AWS Server

### 1. SSH into AWS Server
```bash
ssh ubuntu@3.7.122.146
# or
ssh ec2-user@3.7.122.146
```

### 2. Install Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 3. Clone Repository
```bash
cd ~
git clone https://github.com/harsh11x/culturalhatti.git
cd culturalhatti
```

### 4. Setup PostgreSQL Database
```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE culturalhatti;
CREATE USER postgres WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE culturalhatti TO postgres;
\q
```

### 5. Configure Backend Environment
```bash
cd ~/culturalhatti/backend
nano .env
```

**Paste this and update the values:**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://culturalhatti.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturalhatti
DB_USER=postgres
DB_PASSWORD=your-secure-password-here

# JWT
JWT_SECRET=culturall-hatti-secret-key-2026
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=admin-cultural-hatti-secure-key-24x7

# Razorpay LIVE
RAZORPAY_KEY_ID=rzp_live_SM2JdyoM8GE1uw
RAZORPAY_KEY_SECRET=sf0miRemTCjSSrdf2Eb5tJ67
RAZORPAY_WEBHOOK_SECRET=

# Email - Brevo (UPDATE THESE!)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=your-brevo-smtp-password
EMAIL_FROM=Cultural Hatti <noreply@culturalhatti.in>
ADMIN_EMAIL=harshdevsingh2004@gmail.com

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### 6. Configure Admin Environment
```bash
cd ~/culturalhatti/admin
nano .env.local
```

**Paste this:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### 7. Install Dependencies
```bash
# Backend
cd ~/culturalhatti/backend
npm install

# Admin
cd ~/culturalhatti/admin
npm install
npm run build
```

### 8. Setup Database & Seed Data
```bash
cd ~/culturalhatti/backend
npm run seed
```

**This creates:**
- Admin user: `admin@culturalhatti.in` / `Admin@1234`
- Sample categories and products

### 9. Start Services with PM2
```bash
cd ~/culturalhatti
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Follow the command it gives you (copy-paste and run)
```

### 10. Configure Firewall
```bash
# Allow ports
sudo ufw allow 22    # SSH
sudo ufw allow 3001  # Backend API
sudo ufw allow 3002  # Admin Panel
sudo ufw enable
```

### 11. Check Everything is Running
```bash
pm2 status
pm2 logs

# Test backend
curl http://localhost:3001/api/health

# Test from outside
curl http://3.7.122.146:3001/api/health
```

---

## 🌐 Configure Vercel (Frontend)

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Select Your Project
`culturalhatti` or whatever you named it

### 3. Go to Settings → Environment Variables

### 4. Add These Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `http://3.7.122.146:3001/api` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_SM2JdyoM8GE1uw` |

**If using Firebase (optional):**
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `project-843249196918.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `project-843249196918` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `project-843249196918.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |

### 5. Redeploy
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

## ✅ Testing Checklist

After everything is set up, test these:

### Frontend (https://culturalhatti.com)
- [ ] Homepage loads
- [ ] Products display
- [ ] Can add to cart
- [ ] Cart shows items
- [ ] Checkout page loads
- [ ] Razorpay payment opens
- [ ] Order is created

### Admin (http://3.7.122.146:3002/admin/login)
- [ ] Login page loads
- [ ] Can login with: `admin@culturalhatti.in` / `Admin@1234`
- [ ] Dashboard shows
- [ ] Can view orders
- [ ] Can add products
- [ ] Can upload images
- [ ] Can edit products

### Backend API (http://3.7.122.146:3001)
- [ ] Health check: `curl http://3.7.122.146:3001/api/health`
- [ ] Products API: `curl http://3.7.122.146:3001/api/products`
- [ ] Categories API: `curl http://3.7.122.146:3001/api/categories`

---

## 🆘 Common Issues

### Backend won't start
```bash
pm2 logs culturalhatti-backend
# Check database connection
# Verify .env file exists
```

### Admin build fails
```bash
cd ~/culturalhatti/admin
rm -rf .next node_modules
npm install
npm run build
```

### Can't access from outside
```bash
# Check firewall
sudo ufw status

# Check if services are running
pm2 status
netstat -tulpn | grep :3001
netstat -tulpn | grep :3002
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in backend/.env
# Make sure DB_PASSWORD matches what you set
```

---

## 📝 Important Notes

1. **Email Setup**: Update Brevo SMTP credentials in `backend/.env` for order notifications
2. **Database Backup**: Set up regular backups of PostgreSQL
3. **SSL**: Consider adding SSL certificate for AWS server (Let's Encrypt)
4. **Monitoring**: Use `pm2 monit` to monitor resource usage
5. **Logs**: Check logs regularly with `pm2 logs`

---

## 🔄 Updating Code

When you make changes and push to GitHub:

```bash
# On AWS server
cd ~/culturalhatti
git pull origin main

# Restart services
pm2 restart all

# If admin code changed, rebuild
cd admin
npm run build
pm2 restart culturalhatti-admin
```

---

## 📞 Quick Commands

```bash
# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Start all
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Check status
pm2 status
```

---

## ✨ You're Done!

Your Cultural Hatti e-commerce platform is now live! 🎉

- **Shop**: https://culturalhatti.com
- **Admin**: http://3.7.122.146:3002/admin/login
- **API**: http://3.7.122.146:3001/api

Happy selling! 🛍️
