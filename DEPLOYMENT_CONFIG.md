# Cultural Hatti - Production Deployment Configuration

## 🌐 Infrastructure

- **Frontend**: https://culturalhatti.com (Vercel)
- **Backend API**: http://3.7.122.146:3001 (AWS EC2)
- **Admin Panel**: http://3.7.122.146:3002 (AWS EC2)

## 📝 Configuration Files Updated

### 1. Backend `.env` (on AWS server)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://culturalhatti.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturalhatti
DB_USER=postgres
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=culturall-hatti-secret-key-2026
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=admin-cultural-hatti-secure-key-24x7

# Razorpay LIVE
RAZORPAY_KEY_ID=rzp_live_SM2JdyoM8GE1uw
RAZORPAY_KEY_SECRET=sf0miRemTCjSSrdf2Eb5tJ67
RAZORPAY_WEBHOOK_SECRET=

# Email - Brevo
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
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

### 2. Frontend `.env` (Vercel Environment Variables)
```env
NEXT_PUBLIC_API_URL=http://3.7.122.146:3001/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SM2JdyoM8GE1uw

# Firebase (if configured)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-843249196918.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-843249196918
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-843249196918.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Admin Panel `.env` (on AWS server)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚀 Deployment Steps

### On AWS Server (3.7.122.146)

1. **Install Dependencies**
```bash
# Backend
cd /path/to/culturalhatti/backend
npm install

# Admin
cd /path/to/culturalhatti/admin
npm install
npm run build
```

2. **Setup Database**
```bash
cd /path/to/culturalhatti/backend
npm run seed  # Create admin user and sample data
```

3. **Start with PM2**
```bash
cd /path/to/culturalhatti
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable auto-start on reboot
```

4. **Check Status**
```bash
pm2 status
pm2 logs culturalhatti-backend
pm2 logs culturalhatti-admin
```

### On Vercel (Frontend)

1. **Set Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL` = `http://3.7.122.146:3001/api`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_live_SM2JdyoM8GE1uw`
   - Add Firebase variables if configured

2. **Deploy**
   - Push to GitHub (already done)
   - Vercel will auto-deploy

## 🔧 AWS Server Setup Checklist

- [ ] Install Node.js (v20+)
- [ ] Install PostgreSQL
- [ ] Install PM2 globally: `npm install -g pm2`
- [ ] Clone repository
- [ ] Create backend/.env with production values
- [ ] Create admin/.env.local with localhost API
- [ ] Run database migrations
- [ ] Seed initial data (admin user)
- [ ] Start services with PM2
- [ ] Configure firewall (ports 3001, 3002)
- [ ] Setup Nginx reverse proxy (optional)

## 🔐 Security Notes

1. **CORS**: Backend allows `https://culturalhatti.com`
2. **Razorpay**: Using LIVE keys - real payments will be processed
3. **Database**: Ensure PostgreSQL password is set
4. **Firewall**: Only expose necessary ports
5. **SSL**: Consider adding SSL certificate to AWS server

## 📊 Testing Checklist

- [ ] Frontend loads at https://culturalhatti.com
- [ ] Products display correctly
- [ ] User can add items to cart
- [ ] Checkout flow works
- [ ] Razorpay payment gateway opens
- [ ] Orders are created in database
- [ ] Admin can login at http://3.7.122.146:3002/admin/login
- [ ] Admin can view orders
- [ ] Admin can add/edit products
- [ ] Email notifications are sent
- [ ] Free shipping above ₹999 works

## 🆘 Troubleshooting

### Backend not starting
```bash
pm2 logs culturalhatti-backend
# Check database connection
# Verify .env file exists
```

### Frontend can't connect to backend
- Check AWS security group allows inbound on port 3001
- Verify backend is running: `curl http://3.7.122.146:3001/api/health`
- Check CORS settings in backend

### Admin panel not loading
```bash
pm2 logs culturalhatti-admin
# Verify build completed: ls admin/.next
```

### Payment gateway not working
- Verify Razorpay LIVE keys are correct
- Check Razorpay dashboard for webhook configuration
- Test with small amount first

## 📞 Support

- Backend logs: `pm2 logs culturalhatti-backend`
- Admin logs: `pm2 logs culturalhatti-admin`
- Database: Check PostgreSQL logs
- Email: Verify Brevo SMTP credentials
