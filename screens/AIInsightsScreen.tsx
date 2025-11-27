import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/themed';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../lib/supabase';
import { getFinancialInsights, SpendingData } from '../lib/openai';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../theme/colors';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export default function AIInsightsScreen() {
  const { colors, isDark } = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsights, setAIInsights] = useState<string>('');
  const [aiLoading, setAILoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
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
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const generateAIInsights = useCallback(async () => {
    if (expenses.length === 0) return;

    setAILoading(true);
    try {
      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const byCategory = Object.entries(
        expenses.reduce((acc, exp) => {
          const cat = exp.category || 'other';
          acc[cat] = (acc[cat] || 0) + exp.amount;
          return acc;
        }, {} as { [key: string]: number })
      ).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100,
      })).sort((a, b) => b.amount - a.amount);

      const spendingData: SpendingData = {
        total,
        byCategory,
        transactionCount: expenses.length,
        averageTransaction: total / expenses.length,
        topCategory: byCategory[0]?.category,
      };

      const insights = await getFinancialInsights(spendingData);
      setAIInsights(insights);
      setLastRefresh(new Date());
    } catch (error: any) {
      console.error('Error generating insights:', error);
      setAIInsights('Unable to generate insights. Please try again.');
    } finally {
      setAILoading(false);
    }
  }, [expenses]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const getCategoryData = useMemo(() => {
    return Object.entries(expenses.reduce((acc, exp) => {
      const cat = exp.category || 'other';
      acc[cat] = (acc[cat] || 0) + exp.amount;
      return acc;
    }, {} as { [key: string]: number }))
      .map(([name, amount]) => {
        const categoryColors: { [key: string]: string } = {
          food: colors.categories.food,
          transport: colors.categories.transport,
          shopping: colors.categories.shopping,
          entertainment: colors.categories.entertainment,
          bills: colors.categories.bills,
          health: colors.categories.health,
          other: colors.categories.other,
        };
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          population: amount,
          color: categoryColors[name] || colors.categories.other,
          legendFontColor: colors.text.primary,
          legendFontSize: 12,
        };
      })
      .sort((a, b) => b.population - a.population);
  }, [expenses, colors]);

  const getWeeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyTotals = last7Days.map(date => {
      const dayExpenses = expenses.filter(exp => exp.date === date);
      return dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{ data: dailyTotals.length > 0 ? dailyTotals : [0] }],
    };
  }, [expenses]);

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - (spacing.lg * 2) - (spacing.lg * 2); // Account for container padding + card padding

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient
        colors={[colors.primary.gradient1, colors.primary.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="auto-awesome" type="material" size={32} color={colors.text.inverse} />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={styles.headerTitle}>AI Insights</Text>
              <Text style={styles.headerSubtitle}>Powered by AI</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.main} />}
      >
        {expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="analytics" type="material" size={64} color={colors.text.disabled} />
            <Text style={[styles.emptyText, { color: colors.text.primary }]}>No expenses to analyze</Text>
            <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
              Add some expenses to get AI-powered insights
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.aiCard, { backgroundColor: colors.background.paper }]}>
              <View style={styles.aiHeader}>
                <Text style={[styles.aiTitle, { color: colors.text.primary }]}>💡 Financial Advice</Text>
                {lastRefresh && (
                  <Text style={[styles.lastRefresh, { color: colors.text.secondary }]}>
                    {lastRefresh.toLocaleTimeString()}
                  </Text>
                )}
              </View>

              {aiInsights ? (
                <Text style={[styles.aiText, { color: colors.text.primary }]}>{aiInsights}</Text>
              ) : (
                <Text style={[styles.aiPlaceholder, { color: colors.text.secondary }]}>
                  Tap "Get AI Insights" to analyze your spending and receive personalized recommendations
                </Text>
              )}

              <TouchableOpacity
                onPress={generateAIInsights}
                disabled={aiLoading}
                style={{ marginTop: spacing.md }}
              >
                <LinearGradient
                  colors={[colors.primary.gradient1, colors.primary.gradient2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.aiButton}
                >
                  {aiLoading ? (
                    <ActivityIndicator color={colors.text.inverse} />
                  ) : (
                    <>
                      <Icon name="auto-awesome" type="material" size={20} color={colors.text.inverse} />
                      <Text style={styles.aiButtonText}>
                        {aiInsights ? 'Refresh Insights' : 'Get AI Insights'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={[styles.chartCard, { backgroundColor: colors.background.paper }]}>
              <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Last 7 Days</Text>
              <LineChart
                data={getWeeklyData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: colors.background.paper,
                  backgroundGradientFrom: colors.background.paper,
                  backgroundGradientTo: colors.background.paper,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
                  labelColor: () => colors.text.secondary,
                  style: { borderRadius: borderRadius.md },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: colors.primary.main,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>

            {getCategoryData.length > 0 && (
              <View style={[styles.chartCard, { backgroundColor: colors.background.paper }]}>
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Spending by Category</Text>
                <PieChart
                  data={getCategoryData}
                  width={chartWidth}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            )}

            <View style={[styles.statsCard, { backgroundColor: colors.background.paper }]}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>
                    ${totalSpending.toFixed(2)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total Spent</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>{expenses.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Transactions</Text>
                </View>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>
                    ${(totalSpending / Math.max(expenses.length, 1)).toFixed(2)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Avg per Transaction</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>
                    {getCategoryData[0]?.name || 'N/A'}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Top Category</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: spacing.xxl + 10,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  aiCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  lastRefresh: {
    fontSize: 12,
  },
  aiText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiPlaceholder: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chartCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
