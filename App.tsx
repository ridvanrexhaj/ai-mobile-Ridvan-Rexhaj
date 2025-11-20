import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@rneui/themed';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import ExpenseList from './screens/ExpenseList';
import ExpenseForm from './screens/ExpenseForm';
import { Session } from '@supabase/supabase-js';
import { Expense } from './types';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = (shouldRefresh: boolean = false) => {
    setShowForm(false);
    setEditingExpense(null);
    if (shouldRefresh) {
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {session && session.user ? (
          <>
            <ExpenseList
              session={session}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              refreshKey={refreshKey}
            />
            <Modal
              visible={showForm}
              animationType="slide"
              onRequestClose={() => handleCloseForm(false)}
            >
              <ExpenseForm
                session={session}
                expense={editingExpense}
                onClose={handleCloseForm}
              />
            </Modal>
          </>
        ) : (
          <Auth />
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
