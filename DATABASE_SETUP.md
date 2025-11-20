# Supabase Database Setup Guide

## Quick Setup

1. Go to your Supabase project: https://supabase.com/dashboard/project/aqtmqbzonknztghcqvng

2. Navigate to **SQL Editor** in the left sidebar

3. Copy the entire contents of `supabase-schema.sql` and paste it into the SQL Editor

4. Click **Run** to execute the schema

This will create:
- ✅ Storage buckets for receipts and avatars
- ✅ User profiles table
- ✅ Budgets table
- ✅ Spending insights cache table
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Storage policies for secure file uploads
- ✅ Automatic triggers for profile creation

## What Each Table Does

### `profiles`
Stores user profile information:
- Full name
- Avatar URL
- Currency preference
- Auto-created when user signs up

### `expenses` (existing table - updated)
Added new column:
- `receipt_url` - stores the Supabase storage URL for receipt images

### `budgets`
Tracks spending limits by category:
- Category (e.g., "Food", "Transport")
- Budget amount
- Period (monthly/weekly)
- Alert threshold (e.g., 80% = alert when 80% of budget is used)

### `spending_insights`
Optional cache table for performance:
- Stores pre-calculated insights per month
- Reduces calculation time for dashboard

## Storage Buckets

### `receipts`
- Stores receipt photos
- Private - only accessible to the user who uploaded them
- Organized by user ID folders

### `avatars`
- Stores profile pictures
- Public - anyone can view (for displaying in app)
- Organized by user ID folders

## Security

All tables use Row Level Security (RLS) to ensure:
- Users can only access their own data
- Automatic authentication checks on every query
- No direct database access needed - Supabase handles it all

## Testing

After running the schema, test it by:
1. Creating a new user account in your app
2. Check that a profile was automatically created
3. Try uploading an avatar in the Profile screen
4. Add a budget and verify it's saved
