# Expense Tracker App - Structure & Architecture

## 📁 Directory Structure

```
workspace/
├── App.tsx                          # Root component & navigation setup
├── components/
│   └── Auth.tsx                     # Authentication (Sign In/Up)
├── screens/
│   ├── ExpenseList.tsx             # Main list view with filters
│   ├── ExpenseForm.tsx             # Add/edit expense form
│   ├── ProfileScreen.tsx           # User profile & settings
│   └── AIInsightsScreen.tsx        # AI-powered insights & analytics
├── contexts/
│   └── ThemeContext.tsx            # Global theme management (light/dark mode)
├── lib/
│   ├── supabase.ts                 # Supabase client config & auth
│   └── openai.ts                   # OpenAI integration
├── theme/
│   └── colors.ts                   # Centralized theme & design tokens
├── types/
│   └── index.ts                    # TypeScript interfaces & types
├── assets/                          # Images, icons, and app icon
├── app.json                         # Expo configuration
├── metro.config.js                 # Metro bundler config
├── babel.config.js                 # Babel transpiler config
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies & scripts
└── replit.md                        # Project documentation
```

## 🗂️ File-by-File Breakdown

### Core Files

#### **App.tsx** (Root Component)
- Entry point for the entire app
- Sets up React Navigation (bottom tab navigation)
- Manages authentication state from Supabase
- Conditionally renders Auth screen or main app tabs
- **Tabs**: ExpenseList, ExpenseForm, AIInsights, Profile

#### **components/Auth.tsx**
- Sign in / Sign up forms
- Modern glassmorphic UI with purple gradient
- Email/password authentication via Supabase
- Form validation and error handling
- Toggle between Sign In and Sign Up modes

### Screen Components

#### **screens/ExpenseList.tsx**
- Main expense view with list of all expenses
- **Features**:
  - Collapsible filter with category selection
  - Search functionality for expenses
  - Display total spending amount
  - Individual expense cards with edit/delete
  - Empty state when no expenses
  - Responsive to theme changes

#### **screens/ExpenseForm.tsx**
- Add new or edit existing expenses
- **Features**:
  - Grid layout for 7 expense categories (Food, Transport, Shopping, etc.)
  - Date picker
  - Amount input
  - Description field
  - Color-coded category selection
  - Submit/cancel buttons

#### **screens/AIInsightsScreen.tsx**
- AI-powered expense analysis dashboard
- **Features**:
  - Summary statistics
  - Spending charts
  - AI recommendations using OpenAI
  - Monthly budget tracking
  - Spending insights and trends

#### **screens/ProfileScreen.tsx**
- User profile management
- **Features**:
  - Display user email
  - Avatar upload and display
  - Dark/light theme toggle
  - Sign out button
  - Profile information display

### Context & State Management

#### **contexts/ThemeContext.tsx**
- Global theme management
- **Provides**:
  - `colors` object: All color values for UI
  - `themeMode`: 'light' or 'dark'
  - `toggleTheme()`: Function to switch themes
  - Theme persistence across app sessions

### Configuration & Utilities

#### **lib/supabase.ts**
- Supabase client initialization
- Authentication functions
- Database queries for expenses
- Real-time subscription setup
- Row Level Security policies

#### **lib/openai.ts**
- OpenAI API integration
- Generates spending insights
- Analyzes expense patterns
- Provides AI-powered recommendations

#### **theme/colors.ts**
- Centralized design tokens
- **Exports**:
  - `colors.light`: Light theme palette
  - `colors.dark`: Dark theme palette
  - `colors.categories`: Category-specific colors
  - `spacing`: Padding/margin values
  - `borderRadius`: Border radius values
  - `shadows`: Shadow configurations

#### **types/index.ts**
- TypeScript interface definitions
- **Types**:
  - `User`: User profile data
  - `Expense`: Expense database record
  - `Category`: Expense category
  - `ThemeMode`: 'light' | 'dark'

## 🔄 Data Flow

```
┌─────────────────────────────────────────┐
│         Supabase Backend                │
│  (PostgreSQL Database + Auth)           │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │  lib/supabase.ts│
        │  (API Layer)    │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐    ┌───▼──┐    ┌───▼──┐
│Auth  │    │State │    │Real- │
│Flows │    │Mgmt  │    │time  │
└──────┘    └──────┘    └──────┘
    │            │            │
    ▼            ▼            ▼
┌────────────────────────────────────┐
│     React Components                │
│  (Screens & Contexts)              │
└────────────────────────────────────┘
    │       │        │         │
    ▼       ▼        ▼         ▼
[Auth] [List] [Form] [Profile] [AI]
```

## 🧭 Navigation Structure

```
App Root (Authentication Check)
│
├── Authentication ──┐
│   (If not logged   │
│    in)             │
└────────────────────┼─────────────────────────┐
                     │                         │
                     ▼                         │
                   Auth.tsx                   │
            (Sign In / Sign Up)                │
                     │                         │
                     └──(on success)──────────►│
                                               │
                                              ▼
                        App with Bottom Tabs Navigation
                        │
                ┌───────┼───────┬─────────┬──────────┐
                ▼       ▼       ▼         ▼          ▼
            [Expenses] [Add] [Insights] [Profile] [More]
                │       │        │         │
                ▼       ▼        ▼         ▼
            List   ExpenseForm  AI      Profile
                            Insights
```

## 🎨 Component Hierarchy

```
App (Root)
├── ThemeProvider (context)
├── NavigationContainer
│   └── BottomTabNavigator
│       ├── ExpenseList
│       │   ├── Header (gradient)
│       │   ├── FilterBar (collapsible)
│       │   ├── Statistics Card
│       │   └── ExpenseCard[] (list)
│       ├── ExpenseForm
│       │   ├── CategoryGrid
│       │   ├── DatePicker
│       │   ├── Input Fields
│       │   └── SubmitButton
│       ├── AIInsightsScreen
│       │   ├── SummaryStats
│       │   ├── Charts
│       │   ├── BudgetTracker
│       │   └── AIRecommendations
│       └── ProfileScreen
│           ├── AvatarUpload
│           ├── UserInfo
│           ├── ThemeToggle
│           └── SignOutButton
│
└── AuthComponent (when not logged in)
    ├── GradientBackground
    └── AuthForm (email, password, submit)
```

## 🔑 Key Features

### Authentication
- Email/password registration
- Secure login with Supabase Auth
- Session persistence
- Auto-refresh tokens
- Logout functionality

### Expense Management
- **CRUD Operations**:
  - Create: Add new expenses with category, amount, date, description
  - Read: View all user expenses in list format
  - Update: Edit existing expenses
  - Delete: Remove expenses with instant deletion

### Filtering & Search
- Filter expenses by category
- Search expenses by description
- Collapsible filter UI
- Real-time filtering

### AI Insights
- OpenAI-powered spending analysis
- Category-wise expense breakdown
- Spending trends and patterns
- Monthly budget comparison
- Personalized recommendations

### User Profile
- Avatar upload and display
- User information display
- Theme management (light/dark mode)
- Account settings

### Design System
- **Theme Support**: Light and dark modes
- **Color Palette**: Category-specific colors
- **Spacing System**: Consistent padding/margins
- **Typography**: Hierarchical text styles
- **Shadows & Elevation**: Depth and visual hierarchy

## 🛡️ Security Architecture

### Row Level Security (RLS)
- Users can only access their own expenses
- Database enforces user isolation
- All queries filtered by user_id

### Authentication Flow
```
User Input (Email/Password)
        ↓
    Validate
        ↓
    Send to Supabase Auth
        ↓
    ✓ Verified → Issue Session Token
    ✗ Failed → Show Error
        ↓
    Store Token Securely
        ↓
    Auto-refresh on App Resume
```

## 📦 Dependencies Overview

### Core Framework
- `react`: UI framework
- `react-native`: Mobile framework
- `expo`: Build and deployment platform
- `typescript`: Type safety

### UI Components
- `@rneui/themed`: Themed UI components
- `expo-linear-gradient`: Gradient effects
- `@expo/vector-icons`: Icon library
- `react-native-chart-kit`: Data visualization

### Backend & Storage
- `@supabase/supabase-js`: Database and auth
- `expo-secure-store`: Secure credential storage
- `@react-native-async-storage/async-storage`: Local storage

### Navigation
- `@react-navigation/native`: Navigation framework
- `@react-navigation/bottom-tabs`: Tab navigation

### AI Integration
- `openai`: AI insights and recommendations

## 🚀 Application Flow

### 1. App Launch
```
✓ App initializes
✓ Load theme from storage
✓ Check authentication status
  ├─ If logged in → Show app tabs
  └─ If not → Show auth form
```

### 2. User Authentication
```
✓ User enters email/password
✓ Validate form inputs
✓ Send credentials to Supabase
✓ If successful → Save session token
✓ Redirect to app tabs
```

### 3. Add Expense
```
✓ User navigates to Add tab
✓ Fill form (category, amount, date, description)
✓ Submit form
✓ Send data to Supabase
✓ Expense appears in list (real-time)
```

### 4. View & Filter Expenses
```
✓ ExpenseList loads all user expenses
✓ Calculate total amount
✓ Display expense cards
✓ User opens filter dropdown
✓ Select category/search
✓ Filter updates list (total stays the same)
```

### 5. AI Insights
```
✓ Collect user expenses
✓ Calculate statistics
✓ Send to OpenAI for analysis
✓ Display insights and recommendations
```

### 6. Theme Toggle
```
✓ User taps theme toggle in profile
✓ Update theme in ThemeContext
✓ All components re-render with new colors
✓ Save preference to storage
✓ Persist across sessions
```

## 🔧 API Endpoints (Supabase)

### Authentication
- `signUp()`: Register new user
- `signInWithPassword()`: Login
- `signOut()`: Logout

### Database Operations
- `expenses.select()`: Fetch all user expenses
- `expenses.insert()`: Create new expense
- `expenses.update()`: Edit expense
- `expenses.delete()`: Remove expense

## 💾 Database Schema

### Expenses Table
```sql
expenses:
  - id (UUID, Primary Key)
  - user_id (UUID, Foreign Key → auth.users)
  - amount (decimal)
  - description (text)
  - category (text)
  - date (date)
  - created_at (timestamp)
  - receipt_url (text, optional)
```

## 🎯 State Management Strategy

1. **Authentication State**: Managed by Supabase Auth
2. **Theme State**: Managed by ThemeContext
3. **Form State**: Local component state
4. **Expense Data**: Fetched from Supabase, cached locally
5. **UI State**: Component-level hooks (useState)

## 📱 Responsive Design

- Mobile-first approach
- Adapts to different screen sizes
- Bottom tab navigation for easy thumb access
- Flexible grid layouts
- Scalable text and touch targets

---

**Generated**: November 27, 2025  
**Version**: 1.0.0
