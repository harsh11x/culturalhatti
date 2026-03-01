# Firebase Quick Start - Get Your Config

## Step 1: Get Firebase Configuration

1. Go to: https://console.firebase.google.com/project/project-843249196918/settings/general

2. Scroll down to "Your apps" section

3. If you see a web app (</> icon), click on it. Otherwise, click "Add app" → Web

4. Copy these values and add to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-843249196918.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-843249196918
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-843249196918.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=843249196918
NEXT_PUBLIC_FIREBASE_APP_ID=1:843249196918:web:...
```

## Step 2: Enable Phone Authentication

1. Go to: https://console.firebase.google.com/project/project-843249196918/authentication/providers

2. Click on "Phone" → Enable it

3. Click "Settings" tab → Configure allowed regions:
   - **Allow**: India (IN)
   - Save

## Step 3: Enable Google Sign-In

1. Same page: Click on "Google" → Enable it
2. Add support email: `harshdevsingh2004@gmail.com`
3. Save

## Step 4: Add Authorized Domains

1. Go to: https://console.firebase.google.com/project/project-843249196918/authentication/settings

2. Scroll to "Authorized domains"

3. Add:
   - `culturalhatti-sigma.vercel.app`
   - `culturalhatti.com` (if you have custom domain)
   - `localhost` (already there)

## Step 5: Update Backend Database

```bash
cd backend
psql -U your_db_user -d culturalhatti -f migrations/add-firebase-uid.sql
```

## Step 6: Deploy to Vercel

Add Firebase env variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all `NEXT_PUBLIC_FIREBASE_*` variables

Then redeploy!

## Done!

Your users can now:
- ✅ Login with Phone OTP (+91 numbers)
- ✅ Login with Google
- ✅ Login with Email/Password
- ✅ Use mobile menu (hamburger button works!)
