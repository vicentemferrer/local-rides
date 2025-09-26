import { Stack } from 'expo-router';
import { AuthProvider } from '../src/core/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="user-type-selection" />
        <Stack.Screen name="login" />
        <Stack.Screen name="rider-signup" />
        <Stack.Screen name="driver-signup" />
        <Stack.Screen name="driver-registration-form" />
        <Stack.Screen name="driver-verification-pending" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}