// usePlacesAutocomplete.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPlaceAutocomplete,
  getPlaceDetails,
  generateSessionToken,
  debounce,
  PlacePrediction,
  PlaceDetails,
} from '../src/core/context/googlePlacesService';

interface UsePlacesAutocompleteOptions {
  debounceMs?: number;
  minLength?: number;
  location?: { lat: number; lng: number };
  radius?: number;
}

interface UsePlacesAutocompleteReturn {
  suggestions: PlacePrediction[];
  isLoading: boolean;
  error: Error | null;
  fetchSuggestions: (input: string) => void;
  selectPlace: (placeId: string) => Promise<PlaceDetails | null>;
  clearSuggestions: () => void;
}

export const usePlacesAutocomplete = (
  options: UsePlacesAutocompleteOptions = {}
): UsePlacesAutocompleteReturn => {
  const {
    debounceMs = 300,
    minLength = 2,
    location,
    radius = 50000, // 50km default radius
  } = options;

  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessionTokenRef = useRef<string>(generateSessionToken());

  const fetchSuggestionsInternal = async (input: string) => {
    if (!input || input.length < minLength) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await getPlaceAutocomplete(
        input,
        sessionTokenRef.current,
        location,
        radius
      );
      setSuggestions(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create debounced version of fetch function
  const debouncedFetch = useCallback(
    debounce(fetchSuggestionsInternal, debounceMs),
    [minLength, location, radius]
  );

  const fetchSuggestions = useCallback(
    (input: string) => {
      debouncedFetch(input);
    },
    [debouncedFetch]
  );

  const selectPlace = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      const details = await getPlaceDetails(placeId, sessionTokenRef.current);
      
      // Generate new session token after completing a search session
      sessionTokenRef.current = generateSessionToken();
      
      return details;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch place details'));
      return null;
    }
  };

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    selectPlace,
    clearSuggestions,
  };
};
