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

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginForm: LoginForm): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = MOCK_USER.find(u => u.email === loginForm.email);
    if (!mockUser || loginForm.password.length < 6) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }

    setUser(mockUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const signupRider = async (userRiderData: User): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      ...userRiderData,
      userType: 'rider',
    };

    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
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