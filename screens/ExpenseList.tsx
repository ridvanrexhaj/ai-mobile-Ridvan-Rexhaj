import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { Expense } from '../types';
import { useTheme, lightColors } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../theme/colors';
import ExpenseForm from './ExpenseForm';

const getStyles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    color: colors.text.inverse,
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
    color: colors.text.inverse,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text.inverse,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 2,
  },
  statLabel: {
    color: colors.text.inverse,
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
    backgroundColor: colors.background.secondary,
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
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
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
  budgetSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  budgetLabel: {
    color: colors.text.inverse,
    fontSize: 12,
  },
  budgetAmount: {
    color: colors.text.inverse,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  budgetProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  budgetProgress: {
    height: 6,
    borderRadius: 3,
  },
  budgetRemaining: {
    color: colors.text.inverse,
    fontSize: 11,
  },
  setBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  setBudgetText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
  budgetInputContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  budgetInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    color: colors.text.inverse,
    fontSize: 16,
  },
  budgetButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  budgetSaveButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  budgetCancelButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  budgetButtonText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function ExpenseList() {
  const { colors } = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const styles = getStyles(colors);

  useEffect(() => {
    fetchExpenses();
    loadBudget();
  }, []);

  async function loadBudget() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('monthly_budget')
        .eq('id', user.id)
        .single();

      if (data && data.monthly_budget) {
        setMonthlyBudget(data.monthly_budget.toString());
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    }
  }

  async function saveBudget() {
    try {
      const budget = parseFloat(monthlyBudget);
      if (isNaN(budget) || budget <= 0) {
        Alert.alert('Invalid Budget', 'Please enter a valid amount');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          monthly_budget: budget,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setShowBudgetInput(false);
      Alert.alert('Success', 'Monthly budget saved!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  async function fetchExpenses() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
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

  function handleAddExpense() {
    setEditingExpense(null);
    setShowForm(true);
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleCloseForm(shouldRefresh: boolean = false) {
    setShowForm(false);
    setEditingExpense(null);
    if (shouldRefresh) {
      fetchExpenses();
    }
  }

  async function deleteExpense(id: string) {
    try {
      setExpenses(expenses.filter(e => e.id !== id));
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      fetchExpenses();
    }
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

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      const matchesSearch = !searchText || expense.description.toLowerCase().includes(searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const CATEGORY_LIST = ['all', 'food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'other'];

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
          onPress={() => handleEditExpense(item)}
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
                    handleEditExpense(item);
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

          {monthlyBudget && parseFloat(monthlyBudget) > 0 && (
            <View style={styles.budgetSection}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Monthly Budget</Text>
                <TouchableOpacity onPress={() => setShowBudgetInput(true)}>
                  <Icon name="pencil" type="material-community" size={16} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              </View>
              <Text style={styles.budgetAmount}>${monthlyBudget}</Text>
              <View style={styles.budgetProgressBar}>
                <View 
                  style={[
                    styles.budgetProgress, 
                    { 
                      width: `${Math.min((parseFloat(getTotalExpenses()) / parseFloat(monthlyBudget)) * 100, 100)}%`,
                      backgroundColor: (parseFloat(getTotalExpenses()) / parseFloat(monthlyBudget)) > 0.9 ? colors.danger.main : colors.success.main,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.budgetRemaining}>
                ${Math.max(0, parseFloat(monthlyBudget) - parseFloat(getTotalExpenses())).toFixed(2)} remaining
              </Text>
            </View>
          )}

          {!showBudgetInput && (!monthlyBudget || parseFloat(monthlyBudget) === 0) && (
            <TouchableOpacity 
              style={styles.setBudgetButton}
              onPress={() => setShowBudgetInput(true)}
            >
              <Icon name="wallet-plus" type="material-community" size={20} color="rgba(255,255,255,0.9)" />
              <Text style={styles.setBudgetText}>Set Monthly Budget</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => setShowFilter(!showFilter)}
            style={{ marginTop: spacing.lg, marginHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <Icon name="filter" type="material-community" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={{ color: colors.text.inverse, fontSize: 14, fontWeight: '600', marginLeft: spacing.sm }}>
              {showFilter ? 'Hide Filters' : 'Show Filters'}
            </Text>
          </TouchableOpacity>

          {showFilter && (
            <View style={{ marginTop: spacing.lg, paddingHorizontal: spacing.lg }}>
              <Text style={{ color: colors.text.inverse, fontSize: 14, fontWeight: '600', marginBottom: spacing.md }}>Filter by Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {CATEGORY_LIST.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat === 'all' ? null : cat)}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.full,
                      backgroundColor: (cat === 'all' ? !selectedCategory : selectedCategory === cat) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <Text style={{ color: colors.text.inverse, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                placeholder="Search expenses..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchText}
                onChangeText={setSearchText}
                style={{
                  marginTop: spacing.md,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  color: colors.text.inverse,
                  fontSize: 14,
                }}
              />
            </View>
          )}

          {showBudgetInput && (
            <View style={styles.budgetInputContainer}>
              <TextInput
                style={styles.budgetInput}
                placeholder="Enter budget"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                value={monthlyBudget}
                onChangeText={setMonthlyBudget}
              />
              <View style={styles.budgetButtons}>
                <TouchableOpacity 
                  style={styles.budgetSaveButton}
                  onPress={saveBudget}
                >
                  <Text style={styles.budgetButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.budgetCancelButton}
                  onPress={() => {
                    setShowBudgetInput(false);
                    loadBudget();
                  }}
                >
                  <Text style={styles.budgetButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>

      {loading && expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading expenses...</Text>
        </View>
      ) : getFilteredExpenses().length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="receipt-long" type="material" size={64} color={colors.text.disabled} />
          </View>
          <Text style={styles.emptyText}>{expenses.length === 0 ? 'No expenses yet' : 'No matching expenses'}</Text>
          <Text style={styles.emptySubtext}>{expenses.length === 0 ? 'Start tracking your spending by adding your first expense' : 'Try adjusting your filters'}</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredExpenses()}
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

      <TouchableOpacity style={styles.fab} onPress={handleAddExpense} activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.primary.gradient1, colors.primary.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Icon name="plus" type="material-community" color={colors.text.inverse} size={28} />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={() => handleCloseForm(false)}
      >
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseForm}
        />
      </Modal>
    </View>
  );
}
