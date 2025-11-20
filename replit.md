# Expense Tracker - Replit Project Documentation

## 📋 Overview

**Project**: Mobile Expense Tracker  
**Framework**: React Native with Expo  
**Backend**: Supabase (PostgreSQL + Authentication)  
**Language**: TypeScript  
**Created**: November 20, 2025  
**Status**: Production Ready

## 🎯 Purpose

This is a full-featured expense tracking mobile application that allows users to:
- Create accounts and authenticate securely
- Track their expenses with categories
- View, edit, and delete expenses
- See total expense summaries

## 🏗️ Architecture

### Frontend
- **React Native**: Core mobile framework
- **Expo**: Build and development tooling
- **TypeScript**: Type safety and better DX
- **React Native Elements**: Pre-built UI components

### Backend
- **Supabase**: Provides:
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication (email/password)
  - Real-time capabilities

### Project Structure

```
workspace/
├── App.tsx                    # Root component, handles auth state
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── components/
│   └── Auth.tsx              # Sign in/up component
├── screens/
│   ├── ExpenseList.tsx       # Main expense list view
│   └── ExpenseForm.tsx       # Add/edit expense form
├── types/
│   └── index.ts              # TypeScript interfaces
├── assets/                    # App icons and images
├── package.json              # Dependencies
├── app.json                  # Expo configuration
├── tsconfig.json             # TypeScript config
├── metro.config.js           # Metro bundler config
└── babel.config.js           # Babel transpiler config
```

## 🔧 Configuration

### Environment Variables (Replit Secrets)

The following secrets must be configured:

1. **EXPO_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://xxxxx.supabase.co`
   - Found in: Supabase Dashboard → Project Settings → API

2. **EXPO_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Format: Long base64 string
   - Found in: Supabase Dashboard → Project Settings → API

### Workflow Configuration

- **Name**: Expense Tracker App
- **Command**: `REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0 npm run web`
- **Port**: 5000
- **Output Type**: Webview (frontend)

### Database Schema

The app uses a single `expenses` table:

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2),
  description TEXT,
  category TEXT,
  date DATE,
  created_at TIMESTAMP
);
```

## 🚀 Development

### Running Locally

1. Ensure Supabase credentials are in Replit Secrets
2. The workflow auto-starts the dev server on port 5000
3. Access at: `https://{your-repl-url}` (Replit proxy)

### Making Changes

1. **Frontend Changes**: Edit files in `components/` or `screens/`
2. **Types**: Update `types/index.ts`
3. **Supabase Config**: Modify `lib/supabase.ts`
4. **Styling**: Update inline styles in component files

### Testing

1. Create an account via the Sign Up form
2. Log in with your credentials
3. Add expenses with different categories
4. Test edit and delete functionality
5. Verify totals calculate correctly

## 📦 Dependencies

### Core
- `expo`: Expo SDK (~52.0)
- `react`: React library (18.3.1)
- `react-native`: React Native framework (0.76.5)
- `typescript`: TypeScript support

### UI
- `@rneui/themed`: UI component library
- `@rneui/base`: Base UI components
- `@expo/vector-icons`: Icon library

### Backend
- `@supabase/supabase-js`: Supabase client library
- `react-native-url-polyfill`: URL polyfill for React Native

### Storage
- `@react-native-async-storage/async-storage`: Web storage
- `expo-secure-store`: Secure credential storage (mobile)

## 🔐 Security

### Row Level Security (RLS)

All database operations are protected by RLS policies:
- Users can only read their own expenses
- Users can only insert expenses for themselves
- Users can only update/delete their own expenses

### Authentication

- Email/password authentication via Supabase Auth
- Session tokens stored securely in SecureStore (mobile) or AsyncStorage (web)
- Auto-refresh of authentication tokens
- Secure signout clears all stored credentials

## 🌐 Deployment

### Replit Deployment

1. Click "Deploy" button
2. Ensure Supabase secrets are configured
3. App will be deployed with:
   - Static hosting for web assets
   - Auto-scaling backend
   - HTTPS enabled

### Supabase Setup

Before deployment:
1. Create Supabase project
2. Run SQL schema (see README.md)
3. Enable RLS on expenses table
4. Configure Auth settings (disable email confirmation for easier testing)

## 🐛 Common Issues

### "Cannot connect to Supabase"
- Check Replit Secrets are set correctly
- Verify Supabase project is active
- Ensure RLS policies allow read/write

### "Module not found" errors
- Run `npm install`
- Restart the workflow

### "Port already in use"
- Restart the workflow
- Check no other processes using port 5000

## 📝 Recent Changes

**November 20, 2025**
- Initial project setup
- Implemented authentication (sign up, login, logout)
- Created expense CRUD operations
- Added category-based expense tracking
- Designed modern UI with React Native Elements
- Configured for Replit deployment
- Set up proper workflow on port 5000

## 🎨 User Preferences

- Clean, modern UI design preferred
- Mobile-first approach
- Secure authentication required
- Real-time data sync via Supabase

## 💡 Future Enhancements

Potential improvements:
- Export expenses to CSV
- Expense analytics and charts
- Budget tracking and alerts
- Receipt photo uploads
- Multi-currency support
- Recurring expense templates
- Dark mode support

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Elements](https://reactnativeelements.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Maintenance

### Regular Tasks
- Update dependencies periodically
- Monitor Supabase usage and costs
- Review and update RLS policies as needed
- Test on multiple devices/browsers

### Backup
- Supabase handles automatic backups
- Export data periodically via Supabase dashboard
- Keep environment variables documented

---

**Last Updated**: November 20, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
