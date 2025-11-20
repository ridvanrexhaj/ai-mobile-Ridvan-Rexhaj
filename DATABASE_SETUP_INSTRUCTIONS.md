# 📊 Database Setup Instructions

## 🚨 IMPORTANT: Create Your Database Tables

Your Supabase database is currently empty. You need to create the `expenses` table before the app will work.

## Step 1: Go to Supabase SQL Editor

1. Open your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Click on your project: `aqtmqbzonknztghcqvng`
3. Click on the **SQL Editor** icon in the left sidebar (looks like `</>`)
4. Click **New Query**

## Step 2: Copy and Run This SQL

Copy the entire SQL script below and paste it into the SQL Editor, then click **Run**:

```sql
-- Create expenses table
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 3: Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** and make sure it's **enabled**
3. (Optional) Under **Email** settings, you can:
   - Turn **OFF** "Confirm email" for easier testing (no email verification needed)
   - Or keep it **ON** and check your email for verification links when signing up

## Step 4: Verify the Table Was Created

1. Go to **Table Editor** in the left sidebar
2. You should see a table called **expenses**
3. Click on it to see the columns: `id`, `user_id`, `amount`, `description`, `category`, `date`, `created_at`

## ✅ You're Done!

Once you've run the SQL script, your app will work! You can now:

- **Sign up** for a new account
- **Log in** with your credentials
- **Create, edit, and delete expenses**
- All your data is securely stored in Supabase

---

## 📱 Testing on Your Phone (Mobile App)

This is a **mobile app**, so while you can test it in the web preview, it's designed for iOS and Android. Here's how to test on your phone:

### Option 1: Use Expo Go (Easiest)

1. **Install Expo Go** on your phone:
   - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
   - [Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR Code**:
   - Look at the terminal output in Replit
   - You'll see a QR code displayed
   - Open Expo Go and tap "Scan QR Code"
   - Scan the QR code from the terminal

3. **The app will load on your phone!**

### Option 2: Use the Web Preview (Limited)

The web preview is good for testing, but some features (like camera access, notifications, etc.) only work on real devices.

---

## 🔐 Security Features

Your data is secure:

- ✅ **Row Level Security (RLS)** is enabled
- ✅ Users can **only see their own expenses**
- ✅ All database operations require **authentication**
- ✅ Passwords are **hashed and secured** by Supabase Auth

---

## ❓ Troubleshooting

### "I don't see the expenses table"
- Make sure you ran the SQL script in Step 2
- Check the **Table Editor** tab to verify

### "I can't sign up/login"
- Check that Email authentication is enabled (Step 3)
- If email confirmation is ON, check your email inbox

### "The app still shows a blank screen"
- Make sure you created the database table
- Refresh the page
- Check the browser console for errors

---

**Need help?** Check the `SUPABASE_SETUP.md` file for more details!
