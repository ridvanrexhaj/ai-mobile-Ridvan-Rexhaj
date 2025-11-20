import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Auth from './components/Auth';
import ExpenseList from './screens/ExpenseList';
import ProfileScreen from './screens/ProfileScreen';
import AIInsightsScreen from './screens/AIInsightsScreen';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { isDark, colors } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary.main,
          background: colors.background.primary,
          card: colors.background.paper,
          text: colors.text.primary,
          border: colors.border.main,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary.main,
          background: colors.background.primary,
          card: colors.background.paper,
          text: colors.text.primary,
          border: colors.border.light,
        },
      };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <RNEThemeProvider>
      <NavigationContainer theme={navigationTheme}>
        {session && session.user ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = '';
                let iconType = 'material-community';

                if (route.name === 'Expenses') {
                  iconName = focused ? 'receipt' : 'receipt';
                } else if (route.name === 'Insights') {
                  iconName = focused ? 'chart-line' : 'chart-line';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'account-circle' : 'account-circle';
                }

                return <Icon name={iconName} type={iconType} size={size} color={color} />;
              },
              tabBarActiveTintColor: colors.primary.main,
              tabBarInactiveTintColor: colors.text.secondary,
              tabBarStyle: {
                paddingBottom: 8,
                paddingTop: 8,
                height: 60,
                backgroundColor: colors.background.paper,
                borderTopColor: colors.border.light,
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Expenses" component={ExpenseList} />
            <Tab.Screen name="Insights" component={AIInsightsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        ) : (
          <Auth />
        )}
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavigationContainer>
    </RNEThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
