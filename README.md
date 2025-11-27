# 💰 Expense Tracker

A modern, mobile-first expense tracking application built with React Native, Expo, and Supabase. **Production-ready for Replit, Expo Snacks, and mobile platforms.**

## ✨ Features

- ✅ **User Authentication** - Secure email/password signup and login
- ✅ **Expense Management** - Full CRUD (Create, Read, Update, Delete)
- ✅ **Smart Categories** - Food, Transport, Shopping, Entertainment, Bills, Health
- ✅ **Budget Tracking** - Set monthly budgets with visual progress bars
- ✅ **AI Insights** - OpenAI-powered spending analysis and recommendations
- ✅ **Dark Mode** - Full dark/light theme support with toggle
- ✅ **Cross-Platform** - Works on web, iOS, and Android
- ✅ **Real-time Sync** - All data synced with Supabase backend

## 🚀 Setup Instructions

### Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Key** (long string starting with `eyJ...`)
4. Run this SQL in Supabase **SQL Editor** to create the database schema:

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

-- Create profiles table for avatar/budget
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  monthly_budget DECIMAL(10, 2),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for expenses
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Step 2: Choose Your Platform

#### **Option A: Replit (Recommended for Development)**

1. Add Supabase credentials to **Replit Secrets** (lock icon):
   - `EXPO_PUBLIC_SUPABASE_URL` = your Project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your Anon Key
2. The app starts automatically and runs on port 5000
3. Visit the provided URL to see your app

#### **Option B: Expo Snacks (For Testing)**

1. Clone this repo to GitHub (or use existing GitHub copy)
2. Go to [snack.expo.dev](https://snack.expo.dev)
3. Click **"Import from GitHub"** and paste your repo URL
4. Click the **"Env Variables"** tab (left sidebar) and add:
   - `EXPO_PUBLIC_SUPABASE_URL` = your Project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your Anon Key
5. The app will load and work immediately
6. Use QR code to test on mobile with Expo Go app

#### **Option C: Local Development**

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run the app
npm run web          # For web
npm run ios          # For iOS (requires macOS)
npm run android      # For Android
```

## 📝 Testing the App

1. **Sign up** with any email and password
2. **Add an expense** - fill in amount, description, category, and date
3. **View expenses** - see them listed with totals
4. **Edit/Delete** - manage your expenses
5. **Set budget** - click the budget icon to set a monthly limit
6. **Dark mode** - toggle in the Profile tab
7. **AI Insights** - click the Insights tab to see spending analysis

## 🏗️ Project Structure

```
workspace/
├── App.tsx                      # Main app entry point
├── components/
│   ├── Auth.tsx               # Login/signup screen
│   └── ExpenseForm.tsx        # Add/edit expense form
├── screens/
│   ├── ExpenseList.tsx        # Main expense list view
│   ├── ProfileScreen.tsx      # User profile & settings
│   └── AIInsightsScreen.tsx   # AI-powered insights
├── lib/
│   └── supabase.ts           # Supabase client config
├── contexts/
│   └── ThemeContext.tsx       # Dark/light mode provider
├── theme/
│   └── colors.ts             # Design system & colors
├── types/
│   └── index.ts              # TypeScript interfaces
└── package.json
```

## 🔐 Security Notes

- All database operations use **Row Level Security (RLS)** - users only see their own data
- Passwords are hashed by Supabase Auth
- Session tokens stored securely
- No secrets committed to GitHub

## 🐛 Troubleshooting

### "Backend not functional" / Login not working
- ✅ Check Supabase credentials are correct in environment variables
- ✅ Verify database tables are created (run SQL above)
- ✅ Ensure Row Level Security is enabled

### App shows login screen but nothing happens
- ✅ Check browser console for errors (F12 → Console)
- ✅ Make sure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
- ✅ Try refreshing the page

### Storage errors on Snacks
- ✅ This is normal - Snacks uses in-memory storage, sessions reset on refresh
- ✅ Still works fine, just loses session data on page reload

## 📦 Dependencies

- **expo** ~53.0.0 - Build and deployment framework
- **react-native** 0.76.5 - Mobile UI framework
- **@supabase/supabase-js** 2.48.1 - Backend service
- **@rneui/themed** 4.0.0-rc.8 - UI components
- **expo-linear-gradient** - Gradient backgrounds
- **openai** 6.9.1 - AI insights
- **typescript** - Type safety

## 🚀 Deployment

When ready to deploy:

1. **Replit**: Click "Deploy" button (auto-handles everything)
2. **Vercel/Netlify**: Not suitable for React Native
3. **Expo**: Use `eas build` for native app distribution

## 📚 Resources

- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Elements](https://reactnativeelements.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/)

## 📄 License

MIT - Feel free to use this as a template for your own projects

---

**Status**: ✅ Production Ready | **Last Updated**: November 27, 2025
