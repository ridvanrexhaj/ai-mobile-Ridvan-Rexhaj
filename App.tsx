import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Expenses') {
                  iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'AI Insights') {
                  iconName = focused ? 'sparkles' : 'sparkles-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                } else {
                  iconName = 'ellipse';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
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
            <Tab.Screen name="AI Insights" component={AIInsightsScreen} />
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
