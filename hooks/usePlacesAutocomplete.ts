import { useState, useCallback, useRef } from 'react';
import { getPlacePredictions, getPlaceDetails as fetchPlaceDetails, PlacePrediction, PlaceDetails } from '@/src/core/api/placesService';

export interface UsePlacesAutocompleteReturn {
  predictions: PlacePrediction[];
  isLoading: boolean;
  error: string | null;
  searchPlaces: (input: string) => Promise<void>;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
  clearPredictions: () => void;
}

export function usePlacesAutocomplete(): UsePlacesAutocompleteReturn {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);

  const generateSessionToken = useCallback(() => {
    // Generate a simple session token (in production, use a proper UUID)
    return Math.random().toString(36).substring(2, 15);
  }, []);

  const searchPlaces = useCallback(async (input: string) => {
    if (!input.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate session token if not exists
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = generateSessionToken();
      }

      const results = await getPlacePredictions(
        input,
        sessionTokenRef.current
      );
      setPredictions(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search places');
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, [generateSessionToken]);

  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      const details = await fetchPlaceDetails(
        placeId,
        sessionTokenRef.current || undefined
      );
      return details;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get place details');
      return null;
    }
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
    setError(null);
    sessionTokenRef.current = null;
  }, []);

  return {
    predictions,
    isLoading,
    error,
    searchPlaces,
    getPlaceDetails,
    clearPredictions,
  };
}
