import axios from 'axios';

const GOOGLE_DIRECTIONS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export interface RouteInfo {
	distance: string;
	duration: string;
	distanceValue: number; // in meters
	durationValue: number; // in seconds
	polyline: string;
	steps: RouteStep[];
}

export interface RouteStep {
	instruction: string;
	distance: string;
	duration: string;
}

/**
 * Get directions between two points
 * @param origin - Starting location {lat, lng}
 * @param destination - Ending location {lat, lng}
 * @returns Route information including polyline and duration
 */
export const getDirections = async (
	origin: { lat: number; lng: number },
	destination: { lat: number; lng: number }
): Promise<RouteInfo | null> => {
	try {
		const params = {
			origin: `${origin.lat},${origin.lng}`,
			destination: `${destination.lat},${destination.lng}`,
			key: GOOGLE_DIRECTIONS_API_KEY,
			mode: 'driving',
			alternatives: false
		};

		const response = await axios.get(GOOGLE_DIRECTIONS_API_URL, { params });

		if (response.data.status === 'OK' && response.data.routes.length > 0) {
			const route = response.data.routes[0];
			const leg = route.legs[0];

			const steps: RouteStep[] = leg.steps.map((step: any) => ({
				instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
				distance: step.distance.text,
				duration: step.duration.text
			}));

			return {
				distance: leg.distance.text,
				duration: leg.duration.text,
				distanceValue: leg.distance.value,
				durationValue: leg.duration.value,
				polyline: route.overview_polyline.points,
				steps
			};
		}

		return null;
	} catch (error) {
		console.error('Error fetching directions:', error);
		throw error;
	}
};

/**
 * Decode Google's encoded polyline format
 * @param encoded - Encoded polyline string
 * @returns Array of {latitude, longitude} coordinates
 */
export const decodePolyline = (encoded: string): { latitude: number; longitude: number }[] => {
	const points: { latitude: number; longitude: number }[] = [];
	let index = 0;
	const len = encoded.length;
	let lat = 0;
	let lng = 0;

	while (index < len) {
		let b;
		let shift = 0;
		let result = 0;

		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);

		const dlat = result & 1 ? ~(result >> 1) : result >> 1;
		lat += dlat;

		shift = 0;
		result = 0;

		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);

		const dlng = result & 1 ? ~(result >> 1) : result >> 1;
		lng += dlng;

		points.push({
			latitude: lat / 1e5,
			longitude: lng / 1e5
		});
	}

	return points;
};
