require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

module.exports = {
  expo: {
    name: "Expense Tracker",
    slug: "expense-tracker",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.expensetracker.app"
    },
    android: {
      package: "com.expensetracker.app"
    },
    web: {
      bundler: "metro"
    },
    plugins: [],
    extra: {
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
    }
  }
};
