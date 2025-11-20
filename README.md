# 💰 Expense Tracker

A modern, mobile-first expense tracking application built with React Native, Expo, and Supabase.

## ⚠️ IMPORTANT: Fix Required

**Your Replit Secrets are currently swapped!** The app won't work until you fix this.

**Quick Fix**: In Replit Secrets (🔒):
- `EXPO_PUBLIC_SUPABASE_URL` should be your **Supabase URL** (e.g., `https://xxxxx.supabase.co`)  
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` should be your **anon key** (long JWT starting with `eyJ...`)

📖 **See `ENVIRONMENT_SETUP.md` for detailed step-by-step instructions.**

After fixing, restart the workflow and you're all set! 🎉

---

## ✨ Features

- **User Authentication**: Secure sign up, login, and logout functionality
- **Expense Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Category Organization**: Track expenses by categories (Food, Transport, Shopping, etc.)
- **Real-time Sync**: All data synced with Supabase backend
- **Modern UI**: Sleek, intuitive design with React Native Elements
- **Cross-Platform**: Works on web, iOS, and Android

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ installed
- Supabase account and project
- Expo account (optional, for mobile testing)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Add them to Replit Secrets:
     - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

3. **Create database tables** (run this SQL in Supabase SQL Editor):

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

   -- Create policies
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

4. **Run the app**:
   ```bash
   npm run web
   ```

   The app will be available at `http://localhost:5000`

## 📱 Usage

### Authentication

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Log in with your credentials
3. **Sign Out**: Log out from the app

### Managing Expenses

1. **Add Expense**: Click the + button, fill in the details, and save
2. **View Expenses**: All expenses are displayed in a list with total
3. **Edit Expense**: Click the edit icon on any expense
4. **Delete Expense**: Click the delete icon (confirmation required)

## 🏗️ Project Structure

```
├── App.tsx                 # Main app component
├── lib/
│   └── supabase.ts        # Supabase client configuration
├── components/
│   └── Auth.tsx           # Authentication component
├── screens/
│   ├── ExpenseList.tsx    # Expense list view
│   └── ExpenseForm.tsx    # Add/Edit expense form
├── types/
│   └── index.ts           # TypeScript type definitions
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔒 Security

- **Row Level Security (RLS)**: All database operations are secured with RLS policies
- **Authentication**: Email/password authentication via Supabase Auth
- **Secure Storage**: Credentials stored securely using Expo SecureStore
- **Environment Variables**: Sensitive data managed through environment variables

## 🛠️ Technologies

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build tooling
- **TypeScript**: Type-safe JavaScript
- **Supabase**: Backend-as-a-Service (Authentication + Database)
- **React Native Elements**: UI component library
- **Expo SecureStore**: Secure credential storage

## 📦 Available Scripts

- `npm run web`: Run the web version
- `npm run android`: Run on Android (requires Android Studio)
- `npm run ios`: Run on iOS (requires Xcode, macOS only)
- `npm start`: Start Expo development server

## 🌐 Deployment

This app is configured for deployment on Replit. Simply click the "Deploy" button after adding your Supabase credentials to Replit Secrets.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Tips

- Use meaningful descriptions for your expenses
- Categorize expenses consistently for better tracking
- Review your total expenses regularly
- Enable email verification in Supabase for added security

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Verify your Supabase URL and anon key are correct in Replit Secrets
- Check that your Supabase project is active

### "Authentication failed"
- Ensure email confirmation is disabled in Supabase Auth settings (or check your email)
- Verify your password meets minimum requirements (6+ characters)

### "Cannot read/write expenses"
- Ensure RLS policies are properly configured
- Verify you're logged in

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React Native and Supabase
