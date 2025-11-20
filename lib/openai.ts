import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  dangerouslyAllowBrowser: true,
});

export interface SpendingData {
  total: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  monthOverMonth?: number;
  topCategory?: string;
  transactionCount: number;
  averageTransaction: number;
}

export async function getFinancialInsights(data: SpendingData): Promise<string> {
  try {
    const prompt = `You are a helpful financial advisor. Analyze this spending data and provide personalized, actionable insights:

Total Spending: $${data.total.toFixed(2)}
Number of Transactions: ${data.transactionCount}
Average Transaction: $${data.averageTransaction.toFixed(2)}
${data.monthOverMonth ? `Month-over-Month Change: ${data.monthOverMonth > 0 ? '+' : ''}${data.monthOverMonth.toFixed(1)}%` : ''}

Category Breakdown:
${data.byCategory.map(cat => `- ${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`).join('\n')}

Provide:
1. A brief overview of spending patterns (2-3 sentences)
2. Top 2-3 actionable recommendations to save money or optimize spending
3. One positive observation about their financial habits

Keep your response concise (max 200 words) and friendly.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Unable to generate insights at this time.';
  } catch (error) {
    console.error('Error getting AI insights:', error);
    throw error;
  }
}
