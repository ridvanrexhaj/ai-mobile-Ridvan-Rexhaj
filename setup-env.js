const fs = require('fs');
require('dotenv').config();

// Read from existing .env or environment
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create new .env with EXPO_PUBLIC_ prefix
const envContent = `EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file updated with EXPO_PUBLIC_ variables');
console.log('   EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ (length: ' + supabaseAnonKey.length + ')' : '✗');
