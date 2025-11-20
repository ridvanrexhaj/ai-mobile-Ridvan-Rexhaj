# Supabase Database Setup

## SQL Schema Setup

Run the following SQL in your Supabase SQL Editor to set up the database:

```sql
-- Create expenses table
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);
```

## Authentication Setup

In your Supabase Dashboard:

1. Go to **Authentication → Settings**
2. Under **Email Auth**:
   - Enable Email provider
   - Set "Confirm email" to **OFF** (for easier testing)
   - Or keep it ON and check your email for verification links

## Getting Your Credentials

1. Go to **Project Settings → API**
2. Copy the following:
   - **Project URL**: Add to `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Add to `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Testing the Setup

After running the SQL:

1. Try to sign up a new user
2. The user should appear in **Authentication → Users**
3. Try to create an expense
4. The expense should appear in **Table Editor → expenses**
5. Verify you can only see your own expenses when logged in

## Security Notes

- ✅ Row Level Security (RLS) is enabled
- ✅ Users can only access their own data
- ✅ Authentication is required for all operations
- ✅ Database credentials are secured via Supabase
- ✅ Anon key is safe to expose (protected by RLS)
