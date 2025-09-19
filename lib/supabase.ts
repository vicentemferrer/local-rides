import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';
import { Database } from '../types/database';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please add EXPO_PUBLIC_SUPABASE_URL to your environment variables or app.json extra config.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Please add EXPO_PUBLIC_SUPABASE_ANON_KEY to your environment variables or app.json extra config.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auto-refresh in Expo Go for better development experience
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
