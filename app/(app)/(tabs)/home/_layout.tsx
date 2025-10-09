import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Home'
        }} 
      />
      <Stack.Screen 
        name="booking" 
        options={{ 
          title: 'Book a Ride',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="ride-selection" 
        options={{ 
          title: 'Your Ride',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: 'Payment',
          headerBackVisible: false,
          headerLargeTitle: false,
          //headerBackTitleVisible: false,
        }} 
      />
    </Stack>
  );
}
