import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import locationService from '../services/locationService';

export interface UseLocationTrackingReturn {
  isTracking: boolean;
  startTracking: (driverId: string) => Promise<boolean>;
  stopTracking: () => Promise<void>;
  error: string | null;
}

