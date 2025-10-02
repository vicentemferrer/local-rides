import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { usePlacesAutocomplete } from './usePlacesAutocomplete';
import { PlacePrediction, getPlaceDetails } from '@/src/core/api/placesService';

export function useDestinationSearch() {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { predictions, isLoading: isSearching, error, searchPlaces, clearPredictions } = usePlacesAutocomplete();
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (input.trim()) {
        searchPlaces(input);
        setShowSuggestions(true);
      } else {
        clearPredictions();
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, searchPlaces, clearPredictions]);

  const handlePlaceSelect = async (place: PlacePrediction) => {
    setInput(place.description);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const placeDetails = await getPlaceDetails(place.place_id);
      Alert.alert(
        'Destination Selected',
        `You selected: ${placeDetails.name}\nAddress: ${placeDetails.formatted_address}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get place details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    showSuggestions,
    predictions,
    isSearching,
    error,
    handlePlaceSelect,
  };
}
