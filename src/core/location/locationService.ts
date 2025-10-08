import * as Location from 'expo-location';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Request location permissions from the user
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get the user's current location
 */
export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      //console.log('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Get address from coordinates (Reverse Geocoding)
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses.length > 0) {
      const address = addresses[0];
      const parts = [
        address.name,
        address.street,
        address.city,
        address.region,
      ].filter(Boolean);
      
      return parts.join(', ');
    }

    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

/**
 * Get current location with address
 */
export const getCurrentLocationWithAddress = async (): Promise<UserLocation | null> => {
  try {
    const location = await getCurrentLocation();
    
    if (!location) {
      return null;
    }

    const address = await getAddressFromCoordinates(
      location.latitude,
      location.longitude
    );

    return {
      ...location,
      address: address || 'Current Location',
    };
  } catch (error) {
    console.error('Error getting location with address:', error);
    return null;
  }
};