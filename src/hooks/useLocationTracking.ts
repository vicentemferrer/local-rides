import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import locationService from '../services/locationService';

export interface UseLocationTrackingReturn {
  isTracking: boolean;
  startTracking: (driverId: string) => Promise<boolean>;
  stopTracking: () => Promise<void>;
  error: string | null;
}


  const startTracking = useCallback(
    async (driverId: string): Promise<boolean> => {
      try {
        setError(null);
        const success = await locationService.startTracking(driverId);

        if (success) {
          setIsTracking(true);
          return true;
        } else {
          setError(
            "Failed to start live location tracking - check permissions"
          );
          Alert.alert(
            "Live Location Permission Required",
            "This app needs location permission to track your position for ride services",
            [{ text: "OK" }]
          );
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return false;
      }
    },
    []
  );
