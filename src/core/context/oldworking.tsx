import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../shared/types/navigation';

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'user_data';

// Mock user data for testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@localrides.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    profilePicture: undefined,
  },
  {
    id: '2',
    email: 'demo@localrides.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+0987654321',
    profilePicture: undefined,
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial load

  // Initialize auth state
  useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      } finally {
        setIsLoading(false); // Mark loading as complete whether successful or not
      }
    }
    loadStoredUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple mock authentication
      const mockUser = MOCK_USERS.find(u => u.email === email);

      if (!mockUser || password.length < 6) {
        throw new Error('Invalid email or password');
      }

      setUser(mockUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, 'id'>): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
      };

      setUser(newUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
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
    isAuthenticated: !!user?.id, // This will be correct once loading completes
    isLoading,
    login,
    signup,
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