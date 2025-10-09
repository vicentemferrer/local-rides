// googlePlacesService.ts
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_API_URL; // Replace with your API key
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

export interface PlacePrediction {
  id: string;
  name: string;
  address: string;
  placeId: string;
  description: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

/**
 * Get autocomplete suggestions from Google Places API
 * @param input - The search query text
 * @param sessionToken - Optional session token for billing optimization
 * @param location - Optional lat/lng to bias results
 * @param radius - Optional radius in meters to bias results
 * @returns Array of place predictions
 */
export const getPlaceAutocomplete = async (
  input: string,
  sessionToken?: string,
  location?: { lat: number; lng: number },
  radius?: number
): Promise<PlacePrediction[]> => {
  if (!input || input.trim().length === 0) {
    return [];
  }

  try {
    const params: any = {
      input: input.trim(),
      key: GOOGLE_PLACES_API_KEY,
      sessiontoken: sessionToken,
    };

    // Add location bias if provided
    if (location) {
      params.location = `${location.lat},${location.lng}`;
      if (radius) {
        params.radius = radius;
      }
    }

    const response = await axios.get(
      `${GOOGLE_PLACES_API_URL}/autocomplete/json`,
      { params }
    );

    if (response.data.status === 'OK' && response.data.predictions) {
      return response.data.predictions.map((prediction: any) => ({
        id: prediction.place_id,
        name: prediction.structured_formatting?.main_text || prediction.description,
        address: prediction.structured_formatting?.secondary_text || prediction.description,
        placeId: prediction.place_id,
        description: prediction.description,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching place autocomplete:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific place
 * @param placeId - The Google Place ID
 * @param sessionToken - Optional session token for billing optimization
 * @returns Place details including coordinates
 */
export const getPlaceDetails = async (
  placeId: string,
  sessionToken?: string
): Promise<PlaceDetails | null> => {
  try {
    const params: any = {
      place_id: placeId,
      key: GOOGLE_PLACES_API_KEY,
      fields: 'place_id,name,formatted_address,geometry',
      sessiontoken: sessionToken,
    };

    const response = await axios.get(
      `${GOOGLE_PLACES_API_URL}/details/json`,
      { params }
    );

    if (response.data.status === 'OK' && response.data.result) {
      const result = response.data.result;
      return {
        placeId: result.place_id,
        name: result.name,
        address: result.formatted_address,
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

/**
 * Generate a session token for Places API requests
 * This helps Google consolidate billing for autocomplete + details requests
 * @returns A unique session token (UUID v4)
 */
export const generateSessionToken = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Debounce function to limit API calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};