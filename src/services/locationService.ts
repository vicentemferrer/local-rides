import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { supabase } from '../../lib/supabase';

const LOCATION_TASK_NAME = 'background-location-task';

class LocationService {
  private driverId: string | null = null;
  private isTracking = false;
  private locationSubscription: Location.LocationSubscription | null = null;

  constructor() {
    this.setupBackgroundTask();
  }

  // tracking driver location
  async startTracking(driverId: string): Promise<boolean> {
    if (!(await this.requestPermissions())) {
      return false;
    }

    this.driverId = driverId;

    // foreground tracking (when app is open)
    this.locationSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000 },
      (location) => {
        this.saveLocation(location.coords.latitude, location.coords.longitude);
      }
    );

  // stop tracking
  async stopTracking(): Promise<void> {
    this.locationSubscription?.remove();
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    this.isTracking = false;
    this.driverId = null;
  }

