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

