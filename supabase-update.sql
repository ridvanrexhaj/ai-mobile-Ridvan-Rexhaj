-- Safe Update Script for Expense Tracker
-- This only adds new columns and won't conflict with existing policies
-- Run this in your Supabase SQL Editor

-- Add monthly_budget column to profiles table (for budget tracking feature)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS monthly_budget DECIMAL(10, 2);

-- Add receipt_url column to expenses table (for future receipt upload feature)
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- That's it! Your database is now ready for the new features.
