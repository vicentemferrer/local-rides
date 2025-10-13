import { useAuth } from '@/hooks/useAuth';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    return <Slot />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
