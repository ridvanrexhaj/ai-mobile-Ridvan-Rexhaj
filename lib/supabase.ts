import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { supabaseConfig } from '../config.supabase';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Memory-based storage adapter for web (avoids IndexedDB read-only issues in Snacks)
const memoryStorage: { [key: string]: string } = {};

const MemoryStorageAdapter = {
  getItem: (key: string) => {
    return Promise.resolve(memoryStorage[key] || null);
  },
  setItem: (key: string, value: string) => {
    memoryStorage[key] = value;
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    delete memoryStorage[key];
    return Promise.resolve();
  },
};

// Use environment variables or config file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || supabaseConfig.url;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || supabaseConfig.anonKey;

// Use appropriate storage based on platform
let storageAdapter: any;
if (Platform.OS === 'web') {
  // Use in-memory storage for web to avoid IndexedDB read-only errors in Snacks
  storageAdapter = MemoryStorageAdapter;
} else {
  // Use SecureStore for mobile
  storageAdapter = ExpoSecureStoreAdapter;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
