# Driver Schema Setup Guide

This guide will help you set up the database schema for the Local Rides driver registration system.

## 🗄️ Database Schema

The driver system uses 4 interconnected tables:

1. **`drivers`** - Main driver/user information
2. **`drivers_plates`** - Driver license information (1:1 with drivers)
3. **`vehicles`** - Vehicle information (1:N with drivers)
4. **`driver_documents`** - Document upload status (1:1 with drivers)

## 🚀 Setup Steps

### 1. Create Database Tables

Run the SQL commands in your Supabase dashboard SQL editor:

```sql
-- Copy and paste the contents of supabase/schema.sql
-- This will create all tables, indexes, RLS policies, and triggers
```

### 2. Update Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Update App Layout

Replace the existing AuthProvider with the new SupabaseAuthProvider in your app layout:

```typescript
// In app/_layout.tsx
import { SupabaseAuthProvider } from '../src/core/context/SupabaseAuthContext';

export default function RootLayout() {
  return (
    <SupabaseAuthProvider>
      {/* Your existing app content */}
    </SupabaseAuthProvider>
  );
}
```

### 4. Update Driver Registration Form

The driver registration form has been updated to:
- Include a password field
- Use the new SupabaseAuthContext
- Save data to the database instead of AsyncStorage

### 5. Test the Implementation

1. **Register a new driver** using the registration form
2. **View the driver profile** using the new profile screen
3. **Verify data persistence** by refreshing the app

## 📁 New Files Created

- `supabase/schema.sql` - Complete database schema
- `hooks/useDriverProfile.ts` - Driver profile management hook
- `src/core/context/SupabaseAuthContext.tsx` - Supabase-based auth context
- `app/driver-profile.tsx` - Driver profile view screen
- `types/database.ts` - Updated with new table types

## 🔧 Key Features

### Driver Registration
- ✅ Complete form with personal, license, vehicle, and document info
- ✅ Password field for Supabase Auth
- ✅ Data validation and error handling
- ✅ Automatic profile creation in database

### Driver Profile Management
- ✅ View complete driver profile
- ✅ Real-time data fetching from Supabase
- ✅ Profile completion percentage
- ✅ Document status tracking
- ✅ Multiple vehicle support

### Database Operations
- ✅ Create driver profiles
- ✅ Update profile information
- ✅ Add/remove vehicles
- ✅ Update document status
- ✅ Row Level Security (RLS) policies

## 🛡️ Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **Foreign key constraints** ensure data integrity
- **Input validation** on both client and server side

## 🔄 Data Flow

1. **Registration**: Form → SupabaseAuthContext → Database tables
2. **Login**: Email/Password → Supabase Auth → Load user data
3. **Profile View**: useDriverProfile hook → Fetch related data → Display

## 🧪 Testing

### Test Driver Registration
1. Fill out the driver registration form
2. Submit the form
3. Check Supabase dashboard to verify data was saved
4. Navigate to driver profile screen to view the data

### Test Data Retrieval
1. Login with registered driver credentials
2. Navigate to driver profile screen
3. Verify all data is displayed correctly
4. Test the refresh functionality

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase URL" Error**
   - Check your `.env` file has correct credentials
   - Verify `app.json` has the extra config

2. **"User not authenticated" Error**
   - Make sure you're using SupabaseAuthProvider
   - Check if user is logged in

3. **"No profile found" Error**
   - Verify the driver registration was completed
   - Check if data exists in Supabase dashboard

4. **RLS Policy Errors**
   - Ensure RLS policies are created correctly
   - Check if user is authenticated

### Database Verification

Check your Supabase dashboard to verify:
- Tables are created with correct structure
- RLS policies are enabled
- Indexes are created
- Triggers are working

## 📊 Database Schema Overview

```
drivers (1) ←→ (1) drivers_plates
    ↓
    (1) ←→ (N) vehicles
    ↓
    (1) ←→ (1) driver_documents
```

## 🎯 Next Steps

After setup is complete, you can:
1. Add more vehicle types
2. Implement document upload functionality
3. Add driver verification workflow
4. Create admin dashboard for driver management
5. Add ride booking functionality

## 📝 Notes

- The schema supports multiple vehicles per driver
- Document status can be tracked independently
- All timestamps are automatically managed
- The system is designed to scale with additional features

