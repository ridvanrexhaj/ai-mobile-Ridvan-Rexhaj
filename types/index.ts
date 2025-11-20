export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
}
