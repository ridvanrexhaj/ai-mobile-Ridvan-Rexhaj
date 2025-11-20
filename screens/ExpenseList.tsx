import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Button, Card, Icon } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Expense } from '../types';

interface Props {
  session: Session;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  refreshKey: number;
}

export default function ExpenseList({ session, onAddExpense, onEditExpense, refreshKey }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchExpenses();
    }
  }, [refreshKey]);

  async function fetchExpenses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function deleteExpense(id: string) {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

              if (error) throw error;
              fetchExpenses();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      food: 'restaurant',
      transport: 'directions-car',
      shopping: 'shopping-cart',
      entertainment: 'movie',
      bills: 'receipt',
      health: 'local-hospital',
      other: 'category',
    };
    return icons[category.toLowerCase()] || 'category';
  };

  const renderExpense = ({ item }: { item: Expense }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.expenseRow}>
        <View style={styles.iconContainer}>
          <Icon
            name={getCategoryIcon(item.category)}
            type="material"
            size={28}
            color="#4CAF50"
          />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => onEditExpense(item)}>
              <Icon name="edit" type="material" size={20} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Icon name="delete" type="material" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Expenses</Text>
        <Button
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
          buttonStyle={styles.signOutButton}
          titleStyle={{ fontSize: 14 }}
        />
      </View>

      <Card containerStyle={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses</Text>
        <Text style={styles.totalAmount}>${getTotalExpenses()}</Text>
      </Card>

      {loading && expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading expenses...</Text>
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="receipt-long" type="material" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add your first expense</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpense}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onAddExpense}>
        <Icon name="add" type="material" color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  totalCard: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#4CAF50',
    borderWidth: 0,
  },
  totalLabel: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  totalAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    elevation: 2,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  expenseInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 10,
  },
  category: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
