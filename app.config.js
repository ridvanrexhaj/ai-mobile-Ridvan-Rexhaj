require('dotenv').config();

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
    plugins: []
  }
};
