# 📱 Mobile Setup Guide - Expo Go

## 🚨 Expo Go Version Issue - How to Fix

If you're seeing an "older version of Expo Go" error when scanning the QR code, here's how to fix it:

### Solution: Update Expo Go on Your Phone

Your app uses **Expo SDK 52** (latest version), which requires the **newest Expo Go app**.

#### For iPhone/iPad:
1. Open the **App Store**
2. Search for "Expo Go"
3. Tap **Update** if available
4. Once updated, scan the QR code again from the Replit terminal

#### For Android:
1. Open the **Google Play Store**
2. Search for "Expo Go"
3. Tap **Update** if available
4. Once updated, scan the QR code again from the Replit terminal

---

## 📲 How to Test on Your Phone

### Step 1: Make Sure Expo Go is Updated
See instructions above ☝️

### Step 2: Scan the QR Code
1. Look at the Replit terminal/console - you'll see a QR code displayed
2. Open **Expo Go** on your phone
3. Tap **"Scan QR Code"**
4. Point your camera at the QR code in the terminal
5. Wait a few seconds for the app to load

### Step 3: Use the App!
Once loaded, you can:
- Create an account (Sign Up)
- Log in
- Add expenses
- Edit and delete expenses
- View your total expenses

---

## ✅ Web Testing (Current)

The app **IS functional** on the web preview! Here's how to use it:

### Testing on Web (What You See in Replit):

1. **Sign Up for an Account**
   - Enter your email address
   - Create a password (minimum 6 characters)
   - Click **"Don't have an account? Sign Up"** link
   - Click **"Sign Up"** button
   - Check your email for verification (if enabled in Supabase)

2. **Log In**
   - Enter your email and password
   - Click **"Sign In"** button

3. **Add Your First Expense**
   - Once logged in, click **"+ Add Expense"**
   - Fill in the details:
     - Amount (e.g., 25.50)
     - Description (e.g., "Lunch at cafe")
     - Category (e.g., "Food")
     - Date
   - Click **"Add Expense"**

4. **View Your Expenses**
   - See all your expenses listed
   - View total at the top

5. **Edit or Delete**
   - Click on any expense to edit it
   - Or click the delete button to remove it

---

## 🔄 Why SDK 52?

We're using **Expo SDK 52** because it's the latest stable version with:
- ✅ Latest React Native (0.76)
- ✅ Best security and performance
- ✅ All newest features
- ✅ Works perfectly on web preview
- ✅ Full compatibility with Supabase

The only requirement is that you update Expo Go on your phone to the latest version.

---

## 🆘 Troubleshooting

### "App still won't load on my phone"
- Make sure Expo Go is **fully updated** (check App Store/Play Store again)
- Try force-closing Expo Go and reopening it
- Make sure your phone and computer are on the **same Wi-Fi network**
- Restart the Replit app (refresh the page)

### "I don't see the QR code"
- Look in the Replit **Console/Terminal** tab (bottom of the screen)
- The QR code appears after "Metro waiting on exp://..."

### "The app is slow on web"
- This is normal - it's optimized for mobile devices
- For best performance, test on a real phone using Expo Go

---

## 🎯 Next Steps

1. ✅ **Update Expo Go** on your phone
2. ✅ **Test the app on web** (sign up, add expenses)
3. ✅ **Scan QR code** with updated Expo Go
4. ✅ **Test on your phone** for the best experience

---

**Need help?** The app is working correctly - both web and mobile should work once Expo Go is updated!
