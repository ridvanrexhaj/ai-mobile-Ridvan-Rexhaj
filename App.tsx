import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import Auth from './components/Auth';
import ExpenseList from './screens/ExpenseList';
import ProfileScreen from './screens/ProfileScreen';
import InsightsScreen from './screens/InsightsScreen';
import BudgetsScreen from './screens/BudgetsScreen';
import { colors } from './theme/colors';

const Tab = createBottomTabNavigator();

export default function App() {
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        {session && session.user ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Expenses') {
                  iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'Insights') {
                  iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                } else if (route.name === 'Budgets') {
                  iconName = focused ? 'pie-chart' : 'pie-chart-outline';
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
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Expenses" component={ExpenseList} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
            <Tab.Screen name="Budgets" component={BudgetsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        ) : (
          <Auth />
        )}
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}
