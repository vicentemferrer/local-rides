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


  const signupDriver = async (userDriverData: DriverRegistrationForm): Promise<void> => {
    setIsLoading(true);
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userDriverData.personalInfo.email,
        password: userDriverData.personalInfo.password || 'temp_password_123',
        options: {
          data: {
            first_name: userDriverData.personalInfo.firstName,
            last_name: userDriverData.personalInfo.lastName,
            phone_number: userDriverData.personalInfo.phoneNumber,
            user_type: 'driver',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Create driver record in drivers table
        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            id: data.user.id,
            first_name: userDriverData.personalInfo.firstName,
            last_name: userDriverData.personalInfo.lastName,
            email: userDriverData.personalInfo.email,
            phone_number: userDriverData.personalInfo.phoneNumber,
            user_type: 'driver',
            is_active: true,
            email_verified: false,
            phone_verified: false,
          });

        if (driverError) throw driverError;

        // Create license record
        const { error: licenseError } = await supabase
          .from('drivers_plates')
          .insert({
            user_id: data.user.id,
            license_number: userDriverData.licenseInfo.licenseNumber,
            license_expiry: userDriverData.licenseInfo.expirationDate,
            license_state: userDriverData.licenseInfo.state,
          });

        if (licenseError) throw licenseError;

        // Create vehicle record
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            driver_id: data.user.id,
            make: userDriverData.vehicleInfo.make,
            model: userDriverData.vehicleInfo.model,
            year: userDriverData.vehicleInfo.year,
            color: userDriverData.vehicleInfo.color,
            license_plate: userDriverData.vehicleInfo.licensePlate,
            vehicle_type: 'car',
            seating_capacity: 4,
            is_active: true,
          });

        if (vehicleError) throw vehicleError;

        // Create document status record
        const { error: documentError } = await supabase
          .from('driver_documents')
          .insert({
            driver_id: data.user.id,
            license_status: userDriverData.documents.license,
            insurance_status: userDriverData.documents.insurance,
            registration_status: userDriverData.documents.registration,
          });

        if (documentError) throw documentError;

        await loadUserFromSupabase(data.user);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      }
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
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