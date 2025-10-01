import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DriverRegistrationForm, User, UserType } from '@/src/Styles/drivers';
import { LoginForm } from '@/src/Styles/login';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginForm: LoginForm) => Promise<void>;
  signupRider: (userRiderData: User) => Promise<void>;
  signupDriver: (userDriverData: DriverRegistrationForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const USER_STORAGE_KEY = '@localrides:user';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    initializeAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // User is logged in, fetch and save their profile
        await fetchAndSaveUserProfile(session.user.id);
      } else {
        // No session, clear user
        await clearUserData();
      }
      
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  /** Initialize auth by checking both Supabase session and local storage */
  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      // First, check if we have a stored user profile
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      // Get current Supabase session (this will restore from storage)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        // If there's a session error, try to use stored user
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        // We have an active session, fetch fresh profile
        await fetchAndSaveUserProfile(session.user.id);
      } else if (storedUser) {
        // No session but we have stored user, use it temporarily
        // (though ideally session should exist if user is stored)
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      // Try to load from storage as fallback
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (_storageError) {
        //console.error('Error loading from storage:', storageError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** Fetch user profile from database and save to local storage */
  const fetchAndSaveUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: _profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single() as { data: User; error: any };
      
      if (profile) {
        // Save to both state and local storage
        setUser(profile);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      } else {
        await clearUserData();
      }
    } catch (_error) {
    }
  };

  /** Clear user data from state and storage */
  const clearUserData = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (_error) {
    }
  };

  /** Login user */
  const login = async (loginForm: LoginForm) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password, 
      });
      if (error) throw new Error(error.message);

      // Fetch and save profile info
      if (data.user?.id) {
        await fetchAndSaveUserProfile(data.user.id);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /** Signup Rider */
  const signupRider = async (_userRiderData: User) => {
    setIsLoading(true);
    try {
      // const { email, password, firstName, lastName, phoneNumber } = userRiderData;

      // // Create Supabase Auth account
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password: password ?? Math.random().toString(36).slice(-8),
      // });
      // if (error) throw new Error(error.message);

      // // Check if user was created and is confirmed
      // if (!data.user) throw new Error('User creation failed');

      // // Sign in the user immediately after signup (this sets the session for RLS)
      // const { error: signInError } = await supabase.auth.signInWithPassword({
      //   email,
      //   password: password ?? Math.random().toString(36).slice(-8),
      // });
      // if (signInError) throw new Error(signInError.message);

      // // Insert profile in users table
      // const { error: insertError } = await supabase.from('users').insert([
      //   {
      //     id: data.user.id,
      //     first_name: firstName,
      //     last_name: lastName,
      //     email,
      //     phone_number: phoneNumber,
      //     user_type: 'rider',
      //   },
      // ]);
      // if (insertError) throw new Error(insertError.message);

      // const newUser = {
      //   id: data.user.id,
      //   firstName,
      //   lastName,
      //   email,
      //   phoneNumber,
      //   userType: 'rider',
      // };

      // // Save to state and storage
      // setUser(newUser);
      // await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

      const tempUser = {
        id: 'temp-id',
        firstName: "anonymous",
        lastName: "anonymous",
        email: "anonymous@gmail.com",
        phoneNumber: "000-000-0000",
        userType: 'rider' as UserType,
      };
      
      setUser(tempUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(tempUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /** Signup Driver */
  const signupDriver = async (userDriverData: DriverRegistrationForm) => {
    setIsLoading(true);
    const { personalInfo, licenseInfo, vehicleInfo, documents } = userDriverData;
    const { email, password: rawPassword, firstName, lastName, phoneNumber } = personalInfo;

    try {
      if (!email) throw new Error('Email is required');
      const password = rawPassword ?? Math.random().toString(36).slice(-8);

      // 1. Check signup status
      const { data: existingStatus, error: statusError } = await supabase
        .from('driver_signup_status')
        .select('status')
        .eq('email', email)
        .maybeSingle();
      if (statusError) throw new Error(`Signup status check failed: ${statusError.message}`);

      let userId: string;

      if (existingStatus?.status === 'completed') {
        throw new Error('Signup already completed for this email');
      } else if (existingStatus?.status === 'pending') {
        // Pending signup: sign in existing auth account
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw new Error(`Sign-in failed: ${signInError.message}`);
        userId = signInData.user!.id;
      } else {
        // New signup: create auth account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw new Error(`Auth signup error: ${authError.message}`);
        userId = authData.user!.id;

        // Insert pending signup status
        const { error: pendingError } = await supabase.from('driver_signup_status').insert([{
          email,
          status: 'pending',
          updated_at: new Date().toISOString(),
        }]);
        if (pendingError) throw new Error(`Failed to create pending status: ${pendingError.message}`);
      }

      // 2. Insert main user table
      const { data: existingUser } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();
      if (!existingUser) {
        const { error: userError } = await supabase.from('users').insert([{
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
          user_type: 'driver',
        }]);
        if (userError) throw new Error(`User insert error: ${userError.message}`);
      }

      // 3. Insert driver info
      const { data: existingDriver } = await supabase.from('drivers').select('user_id').eq('user_id', userId).maybeSingle();
      if (!existingDriver) {
        const { error: driverError } = await supabase.from('drivers').insert([{
          user_id: userId,
          license_number: licenseInfo.licenseNumber,
          license_expiry: licenseInfo.expirationDate,
          license_state: licenseInfo.state,
        }]);
        if (driverError) throw new Error(`Driver insert error: ${driverError.message}`);
      }

      // 4. Insert vehicle info
      const { data: existingVehicle } = await supabase.from('vehicles').select('driver_id').eq('driver_id', userId).maybeSingle();
      if (!existingVehicle) {
        const { error: vehicleError } = await supabase.from('vehicles').insert([{
          driver_id: userId,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year,
          color: vehicleInfo.color,
          license_plate: vehicleInfo.licensePlate,
        }]);
        if (vehicleError) throw new Error(`Vehicle insert error: ${vehicleError.message}`);
      }

      // 5. Insert documents
      const { data: existingDocs } = await supabase.from('driver_documents').select('driver_id').eq('driver_id', userId).maybeSingle();
      if (!existingDocs) {
        const { error: docError } = await supabase.from('driver_documents').insert([{
          driver_id: userId,
          license_status: documents.license,
          insurance_status: documents.insurance,
          registration_status: documents.registration,
        }]);
        if (docError) throw new Error(`Document insert error: ${docError.message}`);
      }

      // 6. Mark signup as completed
      const { data, error } = await supabase
        .from('driver_signup_status')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('email', email) as { data: any[] | null; error: any };

      if (error) {
        //console.error('Driver signup error:', error);
      } else if (!data || (Array.isArray(data) && data.length === 0)) {
        // No existing row found, so insert instead
        const { error: insertError } = await supabase
          .from('driver_signup_status')
          .insert([
            {
              email,
              status: 'completed',
              created_at: new Date().toISOString(),
            },
          ]);

        // if (insertError) console.error('Insert error:', insertError);
        // else console.log('Signup created and marked as completed.');
      } else {
        //console.log('Signup marked as completed.');
      }

      // 7. Fetch and save user profile
      await fetchAndSaveUserProfile(userId);

    } catch (error: any) {
      //console.error('Driver signup error:', error);
      //throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /** Logout */
  const logout = async () => {
    await supabase.auth.signOut();
    await clearUserData();
  };

  /** Update Profile */
  const updateProfile = async (userData: Partial<User>) => {
    if (!user?.id) return;
    const updates: any = {
      ...userData,
      updated_at: new Date(),
    };
    const { error } = await supabase.from('users').update(updates).eq('id', user.id);
    if (error) throw new Error(error.message);

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Update storage
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signupRider,
    signupDriver,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};