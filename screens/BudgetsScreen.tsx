import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Input, Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { colors, spacing, borderRadius, shadows, categoryColors, categoryIcons } from '../theme/colors';

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
  alert_threshold: number;
}

interface CategorySpending {
  category: string;
  spent: number;
}

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'other'];

export default function BudgetsScreen() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spending, setSpending] = useState<CategorySpending[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    loadBudgets();
    loadSpending();
  }, []);

  async function loadBudgets() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('period', 'monthly');

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSpending() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      const { data, error } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString());

      if (error) throw error;

      const categoryMap: { [key: string]: number } = {};
      data?.forEach(exp => {
        const cat = exp.category || 'other';
        categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(exp.amount);
      });

      const catSpending = Object.entries(categoryMap).map(([category, spent]) => ({
        category,
        spent,
      }));

      setSpending(catSpending);
    } catch (error) {
      console.error('Error loading spending:', error);
    }
  }

  async function saveBudget() {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingBudget) {
        const { error } = await supabase
          .from('budgets')
          .update({
            amount: parseFloat(budgetAmount),
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBudget.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budgets')
          .insert({
            user_id: user.id,
            category: selectedCategory,
            amount: parseFloat(budgetAmount),
            period: 'monthly',
            alert_threshold: 0.80,
          });

        if (error) throw error;
      }

      Alert.alert('Success', 'Budget saved!');
      setShowForm(false);
      setBudgetAmount('');
      setEditingBudget(null);
      loadBudgets();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBudget(id: string) {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('budgets').delete().eq('id', id);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              loadBudgets();
            }
          },
        },
      ]
    );
  }

  function openEditBudget(budget: Budget) {
    setEditingBudget(budget);
    setSelectedCategory(budget.category);
    setBudgetAmount(budget.amount.toString());
    setShowForm(true);
  }

  function openNewBudget() {
    setEditingBudget(null);
    setSelectedCategory('food');
    setBudgetAmount('');
    setShowForm(true);
  }

  function getSpentAmount(category: string): number {
    const found = spending.find(s => s.category === category);
    return found ? found.spent : 0;
  }

  function getBudgetStatus(budget: Budget) {
    const spent = getSpentAmount(budget.category);
    const percentage = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;

    if (percentage >= 100) {
      return { status: 'over', color: colors.error, message: 'Over budget!' };
    } else if (percentage >= budget.alert_threshold * 100) {
      return { status: 'warning', color: colors.warning, message: 'Near limit' };
    } else {
      return { status: 'good', color: colors.success, message: 'On track' };
    }
  }

  if (loading && budgets.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Budgets</Text>
        <Text style={styles.headerSubtitle}>Track your spending limits</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {budgets.map(budget => {
          const spent = getSpentAmount(budget.category);
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const status = getBudgetStatus(budget);
          const iconName = categoryIcons[budget.category] || 'ellipse';
          const color = categoryColors[budget.category] || categoryColors.other;

          return (
            <View key={budget.id} style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <View style={styles.budgetLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name={iconName as any} size={24} color={color} />
                  </View>
                  <View>
                    <Text style={styles.budgetCategory}>
                      {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                    </Text>
                    <Text style={styles.budgetPeriod}>Monthly Budget</Text>
                  </View>
                </View>
                <View style={styles.budgetActions}>
                  <TouchableOpacity onPress={() => openEditBudget(budget)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color={colors.primary.main} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteBudget(budget.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.budgetProgress}>
                <View style={styles.budgetAmounts}>
                  <Text style={styles.spentAmount}>${spent.toFixed(2)}</Text>
                  <Text style={styles.budgetTotal}>of ${budget.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: status.color }]} />
                </View>
                <View style={styles.budgetStatus}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.message}</Text>
                  <Text style={styles.remainingText}>
                    {budget.amount - spent >= 0 ? `$${(budget.amount - spent).toFixed(2)} left` : 'Budget exceeded'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {budgets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="pie-chart-outline" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No budgets yet</Text>
            <Text style={styles.emptySubtext}>Create a budget to track your spending</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openNewBudget}>
        <LinearGradient
          colors={[colors.primary.main, colors.primary.dark]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBudget ? 'Edit Budget' : 'New Budget'}
              </Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                const color = categoryColors[cat];
                const iconName = categoryIcons[cat] || 'ellipse';

                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    disabled={!!editingBudget}
                    style={[
                      styles.categoryChip,
                      isSelected && { backgroundColor: color + '20', borderColor: color },
                      !!editingBudget && { opacity: 0.5 },
                    ]}
                  >
                    <Ionicons name={iconName as any} size={20} color={color} />
                    <Text style={[styles.categoryChipText, isSelected && { color }]}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.inputLabel}>Monthly Budget Amount</Text>
            <Input
              placeholder="0.00"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
              leftIcon={<Ionicons name="cash-outline" size={20} color={colors.text.secondary} />}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputInner}
            />

            <Button
              title={editingBudget ? 'Update Budget' : 'Create Budget'}
              onPress={saveBudget}
              loading={loading}
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: [colors.primary.main, colors.primary.dark],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
              }}
              buttonStyle={styles.saveButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  budgetPeriod: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  budgetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
  budgetProgress: {
    marginTop: spacing.sm,
  },
  budgetAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  spentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  budgetTotal: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  remainingText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...shadows.xl,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  categoryScroll: {
    marginBottom: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.secondary,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: spacing.md,
  },
  inputInner: {
    borderBottomWidth: 0,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  saveButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
});
