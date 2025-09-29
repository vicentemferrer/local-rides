# Supabase Integration Setup

This project has been configured with Supabase integration. Follow these steps to complete the setup:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Configure Environment Variables

### Option A: Using .env file (Recommended for development)
1. Copy `env.example` to `.env`
2. Replace the placeholder values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Option B: Using app.json (Recommended for production)
1. Update the `extra` section in `app.json`:
   ```json
   "extra": {
     "supabaseUrl": "https://your-project-id.supabase.co",
     "supabaseAnonKey": "your-anon-key"
   }
   ```

## 3. Available Files and Features

### Core Files
- `lib/supabase.ts` - Supabase client configuration
- `types/database.ts` - TypeScript database types
- `hooks/useAuth.ts` - Authentication hook with common auth methods

### Usage Examples

#### Authentication
```typescript
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { user, signInWithEmail, signUpWithEmail, signOut, loading } = useAuth();

  // Use the authentication methods in your components
}
```

#### Database Operations
```typescript
import { supabase } from '../lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ column: 'value' });
```

## 4. Next Steps

1. Update `types/database.ts` with your actual database schema
2. Create your database tables in Supabase dashboard
3. Set up Row Level Security (RLS) policies
4. Implement authentication screens using the `useAuth` hook
5. Add real-time subscriptions if needed

## 5. Additional Dependencies Installed

- `@supabase/supabase-js` - Supabase JavaScript client
- `react-native-url-polyfill` - URL polyfill for React Native compatibility

## 6. Important Notes

- Environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in Expo
- The configuration supports both environment variables and app.json configuration
- For production apps, consider using Expo's secret management features
- Make sure to enable the required authentication providers in your Supabase dashboard

