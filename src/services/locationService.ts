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

	// background tracking
	private setupBackgroundTask() {
		TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
			if (error) return;

			const { locations } = data as any;
			if (locations?.[0]) {
				const location = locations[0];
				this.saveLocation(location.coords.latitude, location.coords.longitude);
			}
		});
	}

	// request location permissions
	private async requestPermissions(): Promise<boolean> {
		const { status } = await Location.requestForegroundPermissionsAsync();
		return status === 'granted';
	}

	// tracking driver location
	async startTracking(userID: string): Promise<boolean> {
		if (!(await this.requestPermissions())) {
			return false;
		}

		const { data, error } = await supabase.from('drivers').select().eq('user_id', userID);

		if (error || data.length === 0) {
			console.error(error);
			return false;
		}

		this.driverId = data[0]?.id;

		// foreground tracking (when app is open)
		this.locationSubscription = await Location.watchPositionAsync(
			{ accuracy: Location.Accuracy.High, timeInterval: 5000 },
			(location) => {
				this.saveLocation(location.coords.latitude, location.coords.longitude);
			}
		);

		// background tracking (when app is minimized)
		await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			accuracy: Location.Accuracy.High,
			timeInterval: 5000
		});

		this.isTracking = true;
		return true;
	}

	// stop tracking
	async stopTracking(): Promise<void> {
		this.locationSubscription?.remove();
		await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		this.isTracking = false;
		this.driverId = null;
	}

	// save location to database
	private async saveLocation(latitude: number, longitude: number): Promise<void> {
		if (!this.driverId) return;

		await supabase.from('drivers_location').insert({
			driver_id: this.driverId,
			latitude,
			longitude,
			timestamp: new Date().toISOString()
		});
	}

	// if tracking check
	isCurrentlyTracking(): boolean {
		return this.isTracking;
	}
}

export const locationService = new LocationService();
export default locationService;
