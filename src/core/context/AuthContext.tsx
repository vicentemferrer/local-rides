import { DriverRegistrationForm, User, UserType } from '@/src/Styles/drivers';
import { LoginForm } from '@/src/Styles/login';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginForm: LoginForm) => Promise<void>;
  signupRider: (userRiderData: User) => Promise<void>;
  signupDriver: (userDriverData: DriverRegistrationForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// No more mock data - using Supabase!

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserFromSupabase(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserFromSupabase(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserFromSupabase = async (supabaseUser: any) => {
    try {
      // Fetch user data from our drivers table
      const { data: driverData, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user from Supabase:', error);
        setIsLoading(false);
        return;
      }

      if (driverData) {
        // Convert Supabase user data to our User interface
        const userData: User = {
          id: driverData.id,
          firstName: driverData.first_name,
          lastName: driverData.last_name,
          email: driverData.email,
          phoneNumber: driverData.phone_number,
          userType: driverData.user_type as UserType,
        };
        setUser(userData);
      } else {
        // User exists in Supabase Auth but not in our drivers table
        // This might be a rider or incomplete registration
        const userData: User = {
          id: supabaseUser.id,
          firstName: supabaseUser.user_metadata?.first_name || '',
          lastName: supabaseUser.user_metadata?.last_name || '',
          email: supabaseUser.email || '',
          phoneNumber: supabaseUser.user_metadata?.phone_number || '',
          userType: 'rider', // Default to rider if not in drivers table
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginForm: LoginForm): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        await loadUserFromSupabase(data.user);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signupRider = async (userRiderData: User): Promise<void> => {
    setIsLoading(true);
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userRiderData.email,
        password: userRiderData.password || 'temp_password_123',
        options: {
          data: {
            first_name: userRiderData.firstName,
            last_name: userRiderData.lastName,
            phone_number: userRiderData.phoneNumber,
            user_type: 'rider',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Create rider record in drivers table (with user_type = 'rider')
        const { error: insertError } = await supabase
          .from('drivers')
          .insert({
            id: data.user.id,
            first_name: userRiderData.firstName,
            last_name: userRiderData.lastName,
            email: userRiderData.email,
            phone_number: userRiderData.phoneNumber,
            user_type: 'rider',
            is_active: true,
            email_verified: false,
            phone_verified: false,
          });

        if (insertError) {
          console.error('Error creating rider record:', insertError);
          // Don't throw here as the auth user was created successfully
        }

        await loadUserFromSupabase(data.user);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signupDriver = async (userDiverData: DriverRegistrationForm): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Longer for "document verification"

    const newDriverUser: DriverRegistrationForm = userDiverData;

    setUser(newDriverUser.personalInfo);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userDiverData));
    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};