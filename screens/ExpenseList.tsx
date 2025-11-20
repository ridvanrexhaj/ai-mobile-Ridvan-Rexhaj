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
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Icon } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Expense } from '../types';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

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
    const icons: { [key: string]: { name: string; type: string } } = {
      food: { name: 'food', type: 'material-community' },
      transport: { name: 'car', type: 'material-community' },
      shopping: { name: 'shopping', type: 'material-community' },
      entertainment: { name: 'movie', type: 'material-community' },
      bills: { name: 'receipt', type: 'material-community' },
      health: { name: 'hospital-box', type: 'material-community' },
      other: { name: 'dots-horizontal-circle', type: 'material-community' },
    };
    const normalizedCategory = (category || 'other').toLowerCase();
    return icons[normalizedCategory] || icons.other;
  };

  const getCategoryColor = (category: string) => {
    const normalizedCategory = (category || 'other').toLowerCase();
    const cat = normalizedCategory as keyof typeof colors.categories;
    return colors.categories[cat] || colors.categories.other;
  };

  const renderExpense = ({ item }: { item: Expense }) => {
    const categoryColor = getCategoryColor(item.category);
    const categoryIcon = getCategoryIcon(item.category);

    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity 
          style={styles.card}
          activeOpacity={0.95}
          onPress={() => onEditExpense(item)}
        >
          <View style={styles.expenseRow}>
            <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}15` }]}>
              <Icon
                name={categoryIcon.name}
                type={categoryIcon.type}
                size={28}
                color={categoryColor}
              />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
              <View style={styles.metaInfo}>
                <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {((item.category || 'other').charAt(0).toUpperCase() + (item.category || 'other').slice(1))}
                  </Text>
                </View>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onEditExpense(item);
                  }}
                >
                  <Icon name="pencil" type="material-community" size={18} color={colors.primary.main} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    deleteExpense(item.id);
                  }}
                >
                  <Icon name="delete" type="material-community" size={18} color={colors.danger.main} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.gradient1, colors.primary.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>Your Expenses</Text>
          </View>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={() => supabase.auth.signOut()}
          >
            <Icon name="logout" type="material-community" size={22} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spending</Text>
          <Text style={styles.totalAmount}>${getTotalExpenses()}</Text>
          <View style={styles.totalStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expenses.length}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {expenses.length > 0 ? (parseFloat(getTotalExpenses()) / expenses.length).toFixed(2) : '0.00'}
              </Text>
              <Text style={styles.statLabel}>Avg. Amount</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {loading && expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading expenses...</Text>
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="receipt-long" type="material" size={64} color={colors.text.disabled} />
          </View>
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>Start tracking your spending by adding your first expense</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpense}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary.main}
              colors={[colors.primary.main]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onAddExpense} activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.primary.gradient1, colors.primary.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Icon name="plus" type="material-community" color={colors.text.inverse} size={28} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingTop: spacing.xxl + 10,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.inverse,
  },
  signOutButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  totalAmount: {
    color: colors.text.inverse,
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  cardWrapper: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actions: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    ...shadows.xl,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
