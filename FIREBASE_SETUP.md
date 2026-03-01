# Firebase Phone Authentication Setup

## Quick Setup Guide

### 1. Firebase Console Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/project/project-843249196918

2. **Enable Authentication**:
   - Click "Authentication" in left sidebar
   - Go to "Sign-in method" tab
   - Enable "Phone" provider
   - Enable "Google" provider

3. **Configure Phone Auth Settings**:
   - In "Sign-in method" → "Phone" → Click "Edit"
   - In "Settings" tab, configure SMS regions:
     - **Allow**: India (IN)
     - **Deny**: All other regions (optional, for cost control)

4. **Add Authorized Domains**:
   - Go to "Settings" → "Authorized domains"
   - Add your domains:
     - `culturalhatti-sigma.vercel.app` (your Vercel domain)
     - `culturalhatti.com` (your custom domain)
     - `localhost` (for development)

5. **Get Firebase Config**:
   - Go to Project Settings (gear icon) → "General" tab
   - Scroll to "Your apps" section
   - Click "Web app" (</> icon) or select existing web app
   - Copy the configuration values

### 2. Update Environment Variables

Add these to your `.env.local` file (root directory):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-843249196918.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-843249196918
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-843249196918.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Update Backend Database

Run the migration to add Firebase UID support:

```bash
cd backend
psql -U your_db_user -d culturalhatti -f migrations/add-firebase-uid.sql
```

Or run manually in your PostgreSQL:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
```

### 4. Restart Services

```bash
# Restart backend
cd backend
pm2 restart culturalhatti-backend

# Restart frontend (if using PM2)
pm2 restart culturalhatti-frontend
```

### 5. Test Phone Authentication

1. Open your website
2. Click "Login / Signup"
3. Select "Phone" tab
4. Enter Indian mobile number (10 digits)
5. Solve reCAPTCHA
6. Enter OTP received via SMS
7. Done!

## Important Notes

- **SMS Costs**: Firebase charges for SMS messages. Monitor usage in Firebase Console.
- **Test Numbers**: For development, you can add test phone numbers in Firebase Console → Authentication → Settings → Phone numbers for testing
- **reCAPTCHA**: Required to prevent abuse. Users will see it on first OTP request.
- **India Only**: Currently configured for Indian phone numbers (+91). Adjust in Firebase Console if needed.

## Troubleshooting

### "SMS quota exceeded"
- Check Firebase Console → Authentication → Usage
- Upgrade Firebase plan if needed

### "reCAPTCHA verification failed"
- Ensure domain is added to Firebase authorized domains
- Check browser console for errors

### "Invalid phone number"
- Phone must be in E.164 format: +91XXXXXXXXXX
- Frontend automatically adds +91 prefix

## Firebase Dashboard Links

- **Project Overview**: https://console.firebase.google.com/project/project-843249196918
- **Authentication**: https://console.firebase.google.com/project/project-843249196918/authentication
- **Usage & Billing**: https://console.firebase.google.com/project/project-843249196918/usage
