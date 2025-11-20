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
- Track their expenses with categories and receipts
- View, edit, and delete expenses
- See total expense summaries and AI insights
- Set monthly budgets and track spending
- Upload profile avatars
- Toggle between light and dark themes

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
│   └── Auth.tsx              # Sign in/up component with gradient design
├── screens/
│   ├── ExpenseList.tsx       # Main expense list view with modern cards
│   ├── ExpenseForm.tsx       # Add/edit expense form with grid layout
│   ├── ProfileScreen.tsx     # User profile with avatar and dark mode toggle
│   └── AIInsightsScreen.tsx  # AI-powered spending insights
├── contexts/
│   └── ThemeContext.tsx      # Theme provider with light/dark mode support
├── theme/
│   └── colors.ts             # Centralized theme configuration
├── types/
│   └── index.ts              # TypeScript interfaces
├── assets/                    # App icons and images
├── ROADMAP.md                # Development roadmap and vision
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
4. **Styling**: Update `theme/colors.ts` for global theme or component styles
5. **Design System**: Use theme constants for consistent spacing, colors, and shadows

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
- `expo-linear-gradient`: Gradient backgrounds and buttons

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

**November 20, 2025 - Icon System & Performance Fixes**
- Replaced all @expo/vector-icons Ionicons with @rneui/themed Icon component for better web compatibility
- Fixed critical infinite render loop by memoizing theme context values with useMemo
- Fixed React hooks order violation by ensuring all hooks run before conditional returns
- Updated all icon references across App.tsx, ExpenseList, ProfileScreen, and AIInsightsScreen
- App now runs smoothly without performance issues or crashes

**November 20, 2025 - Dark Mode & Theme Improvements**
- Implemented fully functional dark mode toggle in Profile screen
- Created ThemeContext with comprehensive light and dark color palettes
- Converted ExpenseList and ProfileScreen to use dynamic theme colors
- Fixed critical text.inverse color issue for readable gradient headers in both themes
- Added theme persistence across app sessions
- Updated navigation icons (receipt, stats-chart, person-circle)
- Moved getStyles functions before components to fix initialization errors
- Successfully tested theme toggle end-to-end with architect verification

**November 20, 2025 - Design Modernization**
- Complete UI/UX overhaul with modern gradient design
- Created centralized theme system (`theme/colors.ts`)
- Updated Auth component with purple gradient background and card-based layout
- Redesigned ExpenseList with gradient header, stats cards, and modern expense cards
- Enhanced ExpenseForm with grid-based category selection and gradient buttons
- Added color-coded category icons and badges
- Improved visual hierarchy and spacing throughout the app
- Created comprehensive development roadmap (ROADMAP.md)

**November 20, 2025 - Initial Launch**
- Initial project setup
- Implemented authentication (sign up, login, logout)
- Created expense CRUD operations
- Added category-based expense tracking
- Configured Supabase integration with RLS
- Set up proper workflow on port 5000

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#6B46C1 to #9333EA)
- **Categories**: Color-coded (Food: Orange, Transport: Blue, Shopping: Pink, etc.)
- **Light Mode**: Light gray background (#F9FAFB) with white cards
- **Dark Mode**: Dark gray background (#111827) with slightly lighter cards
- **Text**: Smart hierarchy with proper contrast in both themes

### Design Principles
- Clean, modern UI with gradient accents
- Full dark mode support with theme toggle
- Mobile-first approach
- Consistent spacing using theme constants
- Card-based layouts with subtle shadows
- Color-coded categories for quick identification
- Smooth touch interactions with active states
- Dynamic theming with readable text on all backgrounds

## 💡 Future Enhancements

Potential improvements:
- Export expenses to CSV
- Enhanced expense analytics and charts
- Budget alert notifications
- Multi-currency support
- Recurring expense templates
- Expense category customization

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
