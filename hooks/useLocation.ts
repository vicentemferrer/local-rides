import {
	Accuracy,
	getCurrentPositionAsync,
	LocationObject,
	LocationSubscription,
	requestBackgroundPermissionsAsync,
	requestForegroundPermissionsAsync,
	watchPositionAsync
} from 'expo-location';
import { useEffect, useState } from 'react';
import { Region } from 'react-native-maps';

export function useLocation() {
	const [location, setLocation] = useState<LocationObject>({} as LocationObject);
	const [region, setRegion] = useState<Region>({} as Region);
	const [locationError, setLocationError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const { status: foreground } = await requestForegroundPermissionsAsync();
			const { status: background } = await requestBackgroundPermissionsAsync();
			if (foreground !== 'granted' || background !== 'granted') {
				setLocationError('Permission to access location was denied');
				return;
			}

			const location = await getCurrentPositionAsync({
				accuracy: Accuracy.High
			});

			const newRegion = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0625,
				longitudeDelta: 0.0625
			};

			setRegion(newRegion);
			setLocation(location);
		})();
	}, []);

	useEffect(() => {
		let subscription: LocationSubscription;

		async function getLocation() {
			subscription = await watchPositionAsync(
				{
					accuracy: Accuracy.High,
					timeInterval: 1000,
					distanceInterval: 5
				},
				(loc) => {
					setLocation(loc);
				}
			);
		}

		getLocation();

		return () => {
			if (subscription) {
				subscription.remove();
			}
		};
	}, []);

	return { location, locationError, region };
}
