# ⚠️ IMPORTANT: Environment Variable Configuration

## Issue Detected

Your Replit Secrets are currently **swapped**. This is preventing the app from connecting to Supabase.

## Current (Incorrect) Configuration

- **EXPO_PUBLIC_SUPABASE_URL** contains: `eyJhbGciOiJI...` (This is your anon key!)
- **EXPO_PUBLIC_SUPABASE_ANON_KEY** contains: A short string (~40 chars) (This is your URL!)

## How to Fix

### Step 1: Access Replit Secrets

1. Click the **Lock icon** (🔒) in the left sidebar OR
2. Click "Tools" → "Secrets" in the Replit interface

### Step 2: Update the Secrets with Correct Values

You need to **swap** the values:

#### EXPO_PUBLIC_SUPABASE_URL
- **Should contain**: Your Supabase project URL
- **Format**: `https://aqtmqbzonknztghcqvng.supabase.co` (approximately 40 characters)
- **Where to find it**: Supabase Dashboard → Project Settings → API → Project URL

#### EXPO_PUBLIC_SUPABASE_ANON_KEY  
- **Should contain**: Your Supabase anonymous/public key
- **Format**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token, 200+ characters)
- **Where to find it**: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`

### Step 3: Restart the Workflow

After updating the secrets:
1. The workflow should automatically restart, OR
2. Manually stop and restart the "Expense Tracker App" workflow

### Step 4: Verify

Once fixed, you should see:
- No more "Invalid supabaseUrl" errors
- The app loads successfully
- You can sign up, log in, and manage expenses

## Example Values (from Supabase Dashboard)

```
Project URL: https://aqtmqbzonknztghcqvng.supabase.co
       ↓ 
EXPO_PUBLIC_SUPABASE_URL

anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdG1xYnpvbmtuenRnaGNxdm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTkwMzAsImV4cCI6MjA3OTE5NTAzMH0.uvPo25mJ2dZG_dJpBagtN-Tytj2OutNGReeb-fiVKBM
       ↓
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

## Need Help?

If you're unsure where to find these values:
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Click the **Settings** gear icon
4. Navigate to **API** section
5. Copy the values exactly as shown

---

**After fixing this, your app will work perfectly!** 🎉
