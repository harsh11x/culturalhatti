# Brevo Email - Quick Setup (2 Minutes)

## 🎯 Get Your SMTP Credentials

### Step 1: Login to Brevo

Go to: **https://app.brevo.com/**

### Step 2: Get SMTP Credentials

1. Click **Settings** (gear icon)
2. Click **SMTP & API**
3. Click **SMTP** tab (NOT API tab)
4. You'll see:
   - **Login:** (your email) ← Copy this
   - **Master password:** (click Show/Copy) ← Copy this

### Step 3: Update `backend/.env`

```env
SMTP_USER=your-brevo-login-email@example.com
SMTP_PASS=your-smtp-master-password-here
```

**Keep these the same:**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
ADMIN_EMAIL=harshdevsingh2004@gmail.com
```

### Step 4: Restart Backend

```bash
cd backend
pm2 restart culturalhatti-backend
# Or if running manually: node src/server.js
```

---

## ✅ Done!

You'll now receive emails at **harshdevsingh2004@gmail.com** for every order with:

- Customer name, email, phone
- Shipping address
- Order items
- Total amount
- Payment ID

---

## 🔍 Important Notes

**API Key vs SMTP Key:**
- ❌ API Key (xkeysib-...) - For API calls only
- ✅ SMTP Key/Password - For sending emails

**Where to Find:**
- API Key: Settings → API tab
- SMTP Credentials: Settings → SMTP tab ← **Use this!**

---

## 📧 Brevo Dashboard

View sent emails: https://app.brevo.com/

- See all sent emails
- Check delivery status
- Monitor email quota (300/day free)

---

**Last Updated:** March 1, 2026
