import OpenAI from 'openai';

// Check if environment variables are available
const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || '';
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || '';

const openai = apiKey && baseURL ? new OpenAI({
  apiKey,
  baseURL,
  dangerouslyAllowBrowser: true,
}) : null;

export interface SpendingData {
  total: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  monthOverMonth?: number;
  topCategory?: string;
  transactionCount: number;
  averageTransaction: number;
}

export async function getFinancialInsights(data: SpendingData): Promise<string> {
  // Note: OpenAI integration requires a backend API endpoint for browser security
  // Browser apps cannot directly access server environment variables
  if (!openai) {
    return `📊 **Your Spending Summary**

Total spent: $${data.total.toFixed(2)} across ${data.transactionCount} transactions
Average per transaction: $${data.averageTransaction.toFixed(2)}

**Top Categories:**
${data.byCategory.slice(0, 3).map(cat => `• ${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`).join('\n')}

💡 **Quick Tips:**
• Your highest spending is in ${data.topCategory || data.byCategory[0]?.category}
• Consider setting a budget for categories where you spend most
• Track your spending weekly to identify patterns

_Note: AI-powered insights require a backend API. To enable this feature, you'll need to create a server endpoint that securely calls the OpenAI API._`;
  }
  
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
