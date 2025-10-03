import Constants from 'expo-constants';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey || 
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  throw new Error('Missing Google Places API Key. Please add EXPO_PUBLIC_GOOGLE_PLACES_API_KEY to your environment variables.');
}

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export async function getPlacePredictions(input: string, sessionToken?: string): Promise<PlacePrediction[]> {
  const params = new URLSearchParams({
    input,
    key: GOOGLE_PLACES_API_KEY,
    types: 'geocode|establishment',
    language: 'en',
  });

  if (sessionToken) {
    params.append('sessiontoken', sessionToken);
  }

  const response = await fetch(`${BASE_URL}/autocomplete/json?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch place predictions');
  }

  const data = await response.json();
  return data.predictions || [];
}

export async function getPlaceDetails(placeId: string, sessionToken?: string): Promise<PlaceDetails> {
  const params = new URLSearchParams({
    place_id: placeId,
    key: GOOGLE_PLACES_API_KEY,
    fields: 'place_id,name,formatted_address,geometry,address_components',
  });

  if (sessionToken) {
    params.append('sessiontoken', sessionToken);
  }

  const response = await fetch(`${BASE_URL}/details/json?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch place details');
  }

  const data = await response.json();
  return data.result;
}
