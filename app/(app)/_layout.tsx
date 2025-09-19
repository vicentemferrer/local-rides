import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../src/core/context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    return <Slot />;
    //return <Redirect href="/(app)/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
