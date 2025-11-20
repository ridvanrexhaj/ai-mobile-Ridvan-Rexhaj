import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input, Icon } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Expense } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../theme/colors';

interface Props {
  expense?: Expense | null;
  onClose: (shouldRefresh?: boolean) => void;
}

export default function ExpenseForm({ expense, onClose }: Props) {
  const { colors } = useTheme();
  
  const CATEGORIES = [
  ];
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setCategory((expense.category || 'other').toLowerCase());
      setDate(expense.date);
    }
  }, [expense]);

  async function saveExpense() {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const expenseData = {
        user_id: user.id,
        amount: numAmount,
        description: description.trim(),
        category: (category || 'other').toLowerCase(),
        date,
      };

      if (expense) {
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', expense.id);

        if (error) throw error;
        Alert.alert('Success', 'Expense updated successfully');
      } else {
        const { error } = await supabase
          .from('expenses')
          .insert([expenseData]);

        if (error) throw error;
        Alert.alert('Success', 'Expense added successfully');
      }

      onClose(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primary.gradient1, colors.primary.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => onClose(false)} style={styles.backButton}>
            <Icon name="arrow-left" type="material-community" size={24} color={colors.text.inverse} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {expense ? 'Edit Expense' : 'Add Expense'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <Input
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                containerStyle={styles.amountInputWrapper}
                inputContainerStyle={styles.amountInput}
                inputStyle={styles.amountText}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Input
              placeholder="What did you spend on?"
              value={description}
              onChangeText={setDescription}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              leftIcon={{ 
                type: 'material-community', 
                name: 'text',
                size: 22,
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.name}
                    style={[
                      styles.categoryCard,
                      isSelected && { 
                        backgroundColor: `${cat.color}15`,
                        borderColor: cat.color,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setCategory(cat.name)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.categoryIconContainer,
                      { backgroundColor: `${cat.color}20` }
                    ]}>
                      <Icon
                        name={cat.icon}
                        type="material-community"
                        size={24}
                        color={cat.color}
                      />
                    </View>
                    <Text style={[
                      styles.categoryName,
                      isSelected && { color: cat.color, fontWeight: '700' }
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              leftIcon={{ 
                type: 'material-community', 
                name: 'calendar',
                size: 22,
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => onClose(false)}
          type="outline"
          buttonStyle={styles.cancelButton}
          titleStyle={styles.cancelButtonText}
          containerStyle={styles.footerButton}
        />
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={saveExpense}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.primary.gradient1, colors.primary.gradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}
          >
            {loading ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <Text style={styles.saveButtonText}>
                {expense ? 'Update' : 'Save'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xxl + 10,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: spacing.lg,
  },
  amountSection: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '800',
    marginRight: spacing.sm,
  },
  amountInputWrapper: {
    flex: 0,
    paddingHorizontal: 0,
  },
  amountInput: {
    borderBottomWidth: 0,
  },
  amountText: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    borderBottomWidth: 0,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  input: {
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...shadows.sm,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.md,
  },
  footerButton: {
    flex: 1,
  },
  cancelButton: {
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
