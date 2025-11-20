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
import { Button, Input } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Expense } from '../types';

interface Props {
  session: Session;
  expense?: Expense | null;
  onClose: (shouldRefresh?: boolean) => void;
}

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Other',
];

export default function ExpenseForm({ session, expense, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setCategory(expense.category);
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
      const expenseData = {
        user_id: session.user.id,
        amount: numAmount,
        description: description.trim(),
        category,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Amount *"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            leftIcon={{ type: 'font-awesome', name: 'dollar' }}
          />

          <Input
            label="Description *"
            placeholder="What did you spend on?"
            value={description}
            onChangeText={setDescription}
            leftIcon={{ type: 'font-awesome', name: 'align-left' }}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            leftIcon={{ type: 'font-awesome', name: 'calendar' }}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => onClose(false)}
              type="outline"
              buttonStyle={styles.cancelButton}
              containerStyle={styles.button}
            />
            <Button
              title={expense ? 'Update' : 'Add'}
              onPress={saveExpense}
              loading={loading}
              disabled={loading}
              buttonStyle={styles.saveButton}
              containerStyle={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#86939e',
    marginLeft: 10,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    borderColor: '#999',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});
