import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { categoryColors, categoryIcons } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

interface CategoryTotal {
  category: string;
  total: number;
}

interface MonthlyTotal {
  month: string;
  total: number;
}

export default function InsightsScreen() {
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [topCategory, setTopCategory] = useState<string>('');

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      if (expenses) {
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        setTotalSpent(total);

        const categoryMap: { [key: string]: number } = {};
        expenses.forEach(exp => {
          const cat = exp.category || 'other';
          categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(exp.amount);
        });

        const catTotals = Object.entries(categoryMap)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total);
        
        setCategoryTotals(catTotals);
        if (catTotals.length > 0) {
          setTopCategory(catTotals[0].category);
        }

        const monthMap: { [key: string]: number } = {};
        expenses.forEach(exp => {
          const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short' });
          monthMap[month] = (monthMap[month] || 0) + parseFloat(exp.amount);
        });

        const monthTotals = Object.entries(monthMap)
          .map(([month, total]) => ({ month, total }))
          .slice(0, 6)
          .reverse();
        
        setMonthlyTotals(monthTotals);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const pieData = categoryTotals.slice(0, 5).map(item => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    population: item.total,
    color: categoryColors[item.category] || categoryColors.other,
    legendFontColor: colors.text.primary,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary.main,
    },
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Insights</Text>
        <Text style={styles.headerSubtitle}>Your spending overview</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1, marginRight: spacing.sm }]}>
            <Ionicons name="wallet" size={24} color={colors.primary.main} />
            <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={[styles.statCard, { flex: 1, marginLeft: spacing.sm }]}>
            <Ionicons name="trending-up" size={24} color={colors.categories.food} />
            <Text style={styles.statValue}>{topCategory || 'N/A'}</Text>
            <Text style={styles.statLabel}>Top Category</Text>
          </View>
        </View>

        {monthlyTotals.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending Trend</Text>
            <LineChart
              data={{
                labels: monthlyTotals.map(m => m.month),
                datasets: [{ data: monthlyTotals.map(m => m.total) }],
              }}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {categoryTotals.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Category Breakdown</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        <View style={styles.categoryList}>
          <Text style={styles.chartTitle}>Top Categories</Text>
          {categoryTotals.map((item, index) => {
            const iconName = categoryIcons[item.category] || 'ellipse';
            const color = categoryColors[item.category] || categoryColors.other;
            const percentage = ((item.total / totalSpent) * 100).toFixed(1);

            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name={iconName as any} size={20} color={color} />
                  </View>
                  <View>
                    <Text style={styles.categoryName}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Text>
                    <Text style={styles.categoryPercentage}>{percentage}% of total</Text>
                  </View>
                </View>
                <Text style={styles.categoryAmount}>${item.total.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  categoryList: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    marginBottom: spacing.xl,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryPercentage: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});
