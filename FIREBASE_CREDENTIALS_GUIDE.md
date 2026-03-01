# 🔥 Firebase Setup - Get Your Credentials

## Your Firebase Project
- **Project ID**: `project-843249196918`
- **Project URL**: https://console.firebase.google.com/project/project-843249196918

---

## 📋 How to Get Firebase Credentials

### Step 1: Go to Firebase Console
Visit: https://console.firebase.google.com/project/project-843249196918/settings/general

### Step 2: Scroll Down to "Your apps"
Look for the section that says **"Your apps"** or **"SDK setup and configuration"**

### Step 3: Find Your Web App
- If you see a web app (</> icon), click on it
- If you don't see any apps, click **"Add app"** → Select **Web** (</> icon)
- Give it a name: "Cultural Hatti Web"

### Step 4: Copy the Config
You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",                           // ← Copy this
  authDomain: "project-843249196918.firebaseapp.com",
  projectId: "project-843249196918",
  storageBucket: "project-843249196918.appspot.com",
  messagingSenderId: "123456789",              // ← Copy this
  appId: "1:123456789:web:abc123"              // ← Copy this
};
```

---

## 🎯 What You Need to Copy:

From the Firebase config above, copy these **3 values**:

1. **`apiKey`** - Starts with "AIza..."
2. **`messagingSenderId`** - A number like "843249196918"
3. **`appId`** - Starts with "1:" and ends with ":web:..."

---

## 📝 Where to Add Them:

### On Vercel Dashboard:

Add these 3 environment variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your `apiKey` from Firebase | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your `messagingSenderId` from Firebase | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your `appId` from Firebase | Production, Preview, Development |

**Already configured (no need to add):**
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Already in code
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Already in code
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Already in code

---

## 🔐 Step 5: Enable Authentication Methods

### Enable Phone Authentication:
1. Go to: https://console.firebase.google.com/project/project-843249196918/authentication/providers
2. Click **"Phone"**
3. Click **"Enable"**
4. Click **"Save"**

### Enable Google Authentication:
1. Same page, click **"Google"**
2. Click **"Enable"**
3. Enter support email: `harshdevsingh2004@gmail.com`
4. Click **"Save"**

---

## 🌐 Step 6: Add Authorized Domains

1. Go to: https://console.firebase.google.com/project/project-843249196918/authentication/settings
2. Scroll to **"Authorized domains"**
3. Add these domains:
   - `culturalhatti.com` (click Add domain)
   - `www.culturalhatti.com` (click Add domain)
   - `culturalhatti-sigma.vercel.app` (if that's your Vercel domain)
   - `localhost` (should already be there)

---

## ✅ Complete Vercel Environment Variables List

After Firebase setup, you should have **5 variables** in Vercel:

1. ✅ `NEXT_PUBLIC_API_URL` = `http://3.7.122.146:3001/api`
2. ✅ `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_live_SM2JdyoM8GE1uw`
3. 🔥 `NEXT_PUBLIC_FIREBASE_API_KEY` = Your API key
4. 🔥 `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = Your sender ID
5. 🔥 `NEXT_PUBLIC_FIREBASE_APP_ID` = Your app ID

---

## 🚀 After Adding All Variables:

1. **Redeploy** on Vercel
2. Visit https://culturalhatti.com
3. Click **Login/Signup**
4. You should see:
   - 📱 **Phone** tab (for OTP login)
   - 📧 **Email** tab (for email/password)
   - 🔵 **Continue with Google** button

---

## 🧪 Test Firebase Login:

### Test Phone Login:
1. Click **Phone** tab
2. Enter Indian mobile: `+91 9876543210`
3. Click **Send OTP**
4. Enter the OTP you receive
5. Should login successfully

### Test Google Login:
1. Click **Continue with Google**
2. Select your Google account
3. Should login successfully

---

## 🆘 If Something Doesn't Work:

### Check Firebase Console:
- Authentication methods are enabled
- Authorized domains include `culturalhatti.com`
- Web app is registered

### Check Vercel:
- All 5 environment variables are added
- Project is redeployed after adding variables

### Check Browser Console:
- Open DevTools (F12)
- Look for Firebase errors
- Share any error messages

---

## 📞 Quick Links:

- Firebase Console: https://console.firebase.google.com/project/project-843249196918
- Firebase Settings: https://console.firebase.google.com/project/project-843249196918/settings/general
- Firebase Auth: https://console.firebase.google.com/project/project-843249196918/authentication/providers
- Vercel Dashboard: https://vercel.com/dashboard

---

That's it! Once you add those 3 Firebase values to Vercel, phone and Google login will work! 🎉
