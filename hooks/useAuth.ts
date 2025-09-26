import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DriverRegistrationForm, User, UserType } from '@/src/Styles/drivers';
import { LoginForm } from '@/src/Styles/login';
import { supabase } from '@/lib/supabase';

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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  /** Fetch currently logged-in user */
  const fetchCurrentUser = async () => {
    setIsLoading(true);
    const { data: currentUser, error } = await supabase.auth.getUser();
    if (error) console.error('Supabase fetch user error:', error);
    if (currentUser?.user) {
      // Fetch additional profile from users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.user.id)
        .single() as { data: User; error: any };
      setUser(profile ?? null);
    }
    setIsLoading(false);
  };

  /** Login user */
  const login = async (loginForm: LoginForm) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (error) throw new Error(error.message);

    // Fetch profile info
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user?.id)
      .single() as { data: User; error: any };

    setUser(profile ?? null);
    setIsLoading(false);
  };

  /** Signup Rider */
  const signupRider = async (userRiderData: User) => {
    setIsLoading(true);
    const { email, password, firstName, lastName, phoneNumber } = userRiderData;

    // Create Supabase Auth account
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password ?? Math.random().toString(36).slice(-8),
    });
    if (error) throw new Error(error.message);

    // Insert profile in users table
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: data.user?.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        user_type: 'rider',
      },
    ]);
    if (insertError) throw new Error(insertError.message);

    setUser({
      id: data.user?.id,
      firstName,
      lastName,
      email,
      phoneNumber,
      userType: 'rider',
    });
    setIsLoading(false);
  };

  /** Signup Driver */
  const signupDriver = async (userDriverData: DriverRegistrationForm) => {
    setIsLoading(true);
    const { personalInfo, licenseInfo, vehicleInfo, documents } = userDriverData;
    const { email, password, firstName, lastName, phoneNumber } = personalInfo;

    // 1. Create Auth account
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password ?? Math.random().toString(36).slice(-8),
    });
    if (error) throw new Error(error.message);

    const userId = data.user?.id;
    if (!userId) throw new Error('Driver signup failed: no user id');

    // 2. Insert profile
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        user_type: 'driver',
      },
    ]);
    if (profileError) throw new Error(profileError.message);

    // 3. Insert driver info
    const { error: driverError } = await supabase.from('drivers').insert([
      {
        user_id: userId,
        license_number: licenseInfo.licenseNumber,
        license_expiry: licenseInfo.expirationDate,
        license_state: licenseInfo.state,
      },
    ]);
    if (driverError) throw new Error(driverError.message);

    // 4. Insert vehicle info
    const { error: vehicleError } = await supabase.from('vehicles').insert([
      {
        driver_id: userId,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
        color: vehicleInfo.color,
        license_plate: vehicleInfo.licensePlate,
      },
    ]);
    if (vehicleError) throw new Error(vehicleError.message);

    // 5. Insert document status
    const { error: docError } = await supabase.from('driver_documents').insert([
      {
        driver_id: userId,
        license_status: documents.license,
        insurance_status: documents.insurance,
        registration_status: documents.registration,
      },
    ]);
    if (docError) throw new Error(docError.message);

    setUser(personalInfo);
    setIsLoading(false);
  };

  /** Logout */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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

    setUser(prev => ({ ...prev!, ...userData }));
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
    <AuthContext.Provider value= { value } >
    { children }
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
