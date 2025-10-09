import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { PlaceDetails } from '@/src/core/context/googlePlacesService';
import { getCurrentLocationWithAddress } from '@/src/core/location/locationService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT_LOCATIONS_KEY = '@recent_locations';
const MAX_RECENT_LOCATIONS = 5;

interface RecentLocation {
  id: string;
  name: string;
  address: string;
  placeId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export default function BookingScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originPlaceId, setOriginPlaceId] = useState<string | null>(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState<string | null>(null);
  const [originDetails, setOriginDetails] = useState<PlaceDetails | null>(null);
  const [destinationDetails, setDestinationDetails] = useState<PlaceDetails | null>(null);
  const [originFocused, setOriginFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [recentLocations, setRecentLocations] = useState<RecentLocation[]>([]);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  // Separate hooks for origin and destination
  const originAutocomplete = usePlacesAutocomplete({
    debounceMs: 300,
    minLength: 2,
  });

  const destinationAutocomplete = usePlacesAutocomplete({
    debounceMs: 300,
    minLength: 2,
  });

  // Load recent locations on mount
  useEffect(() => {
    loadRecentLocations();
    initializeOriginWithCurrentLocation();
  }, []);

  const loadRecentLocations = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
      if (stored) {
        setRecentLocations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent locations:', error);
    }
  };

  const saveRecentLocation = async (location: RecentLocation) => {
    try {
      const existing = [...recentLocations];
      
      // Remove if already exists (to avoid duplicates)
      const filtered = existing.filter(loc => 
        loc.placeId ? loc.placeId !== location.placeId : loc.name !== location.name
      );
      
      // Add to beginning
      const updated = [location, ...filtered].slice(0, MAX_RECENT_LOCATIONS);
      
      setRecentLocations(updated);
      await AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updated));
    } catch (_error) {
      //console.error('Error saving recent location:', error);
    }
  };

  const initializeOriginWithCurrentLocation = async () => {
    setIsLoadingCurrentLocation(true);
    try {
      const location = await getCurrentLocationWithAddress();
      if (location) {
        setOrigin(location.address || 'Current Location');
        setOriginDetails({
          placeId: 'current_location',
          name: location.address || 'Current Location',
          address: location.address || 'Your current location',
          location: {
            lat: location.latitude,
            lng: location.longitude,
          },
        });
      }
    } catch (_error) {
      //console.error('Error getting current location:', error);
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleOriginChange = (text: string) => {
    setOrigin(text);
    setOriginPlaceId(null);
    originAutocomplete.fetchSuggestions(text);
  };

  const handleDestinationChange = (text: string) => {
    setDestination(text);
    setDestinationPlaceId(null);
    destinationAutocomplete.fetchSuggestions(text);
  };

  const selectOrigin = async (placeId: string, name: string) => {
    setOrigin(name);
    setOriginPlaceId(placeId);
    originAutocomplete.clearSuggestions();
    Keyboard.dismiss();

    const details = await originAutocomplete.selectPlace(placeId);
    if (details) {
      setOriginDetails(details);
      
      // Save to recent locations
      await saveRecentLocation({
        id: placeId,
        name: details.name,
        address: details.address,
        placeId: placeId,
        location: details.location,
      });
    }
  };

  const selectDestination = async (placeId: string, name: string) => {
    setDestination(name);
    setDestinationPlaceId(placeId);
    destinationAutocomplete.clearSuggestions();
    Keyboard.dismiss();

    const details = await destinationAutocomplete.selectPlace(placeId);
    
    if (details) {
      setDestinationDetails(details);
      
      // Save to recent locations
      await saveRecentLocation({
        id: placeId,
        name: details.name,
        address: details.address,
        placeId: placeId,
        location: details.location,
      });
    }
  };

  const selectRecentLocation = async (location: RecentLocation, isOrigin: boolean) => {
    if (isOrigin) {
      setOrigin(location.name);
      if (location.placeId && location.location) {
        setOriginPlaceId(location.placeId);
        setOriginDetails({
          placeId: location.placeId,
          name: location.name,
          address: location.address,
          location: location.location,
        });
      }
    } else {
      setDestination(location.name);
      if (location.placeId && location.location) {
        setDestinationPlaceId(location.placeId);
        setDestinationDetails({
          placeId: location.placeId,
          name: location.name,
          address: location.address,
          location: location.location,
        });
      }
    }
  };

  const handleSwapLocations = () => {
    const tempText = origin;
    setOrigin(destination);
    setDestination(tempText);

    const tempPlaceId = originPlaceId;
    setOriginPlaceId(destinationPlaceId);
    setDestinationPlaceId(tempPlaceId);

    const tempDetails = originDetails;
    setOriginDetails(destinationDetails);
    setDestinationDetails(tempDetails);
  };

  const handleConfirmBooking = () => {
    if (originDetails && destinationDetails) {
      router.push({
        pathname: '/(app)/(tabs)/home/ride-selection',
        params: {
          originLat: originDetails.location.lat,
          originLng: originDetails.location.lng,
          originName: originDetails.name,
          originAddress: originDetails.address,
          destLat: destinationDetails.location.lat,
          destLng: destinationDetails.location.lng,
          destName: destinationDetails.name,
          destAddress: destinationDetails.address,
        },
      });
    }
  };

  const renderSuggestion = (
    item: any,
    onSelect: (placeId: string, name: string) => void,
    isLoading: boolean
  ) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onSelect(item.placeId, item.name)}
      onPressIn={() => {
        // To provide immediate feedback on press
        if (!isLoading) {
          //console.log('Pressed suggestion:', item.name);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionIcon}>
        <Ionicons name="location-outline" size={20} color="#007AFF" />
      </View>
      <View style={styles.suggestionText}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1D1D1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Ride</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <View style={styles.dotContainer}>
              <View style={styles.originDot} />
              <View style={styles.connector} />
              <View style={styles.destinationDot} />
            </View>

            <View style={styles.inputsWrapper}>
              <View style={styles.inputWrapper}>
                <Ionicons name="radio-button-on" size={16} color="#34C759" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, originFocused && styles.inputFocused]}
                  placeholder="Pick-up location"
                  placeholderTextColor="#8E8E93"
                  value={origin}
                  onChangeText={handleOriginChange}
                  onFocus={() => setOriginFocused(true)}
                  onBlur={() => setOriginFocused(false)}
                />
                {(originAutocomplete.isLoading || isLoadingCurrentLocation) && (
                  <ActivityIndicator size="small" color="#007AFF" />
                )}
                {origin.length > 0 && !originAutocomplete.isLoading && !isLoadingCurrentLocation && (
                  <TouchableOpacity onPress={() => {
                    setOrigin('');
                    setOriginPlaceId(null);
                    setOriginDetails(null);
                    originAutocomplete.clearSuggestions();
                  }}>
                    <Ionicons name="close-circle" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="location" size={16} color="#FF3B30" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, destinationFocused && styles.inputFocused]}
                  placeholder="Drop-off location"
                  placeholderTextColor="#8E8E93"
                  value={destination}
                  onChangeText={handleDestinationChange}
                  onFocus={() => setDestinationFocused(true)}
                  onBlur={() => setDestinationFocused(false)}
                />
                {destinationAutocomplete.isLoading && (
                  <ActivityIndicator size="small" color="#007AFF" />
                )}
                {destination.length > 0 && !destinationAutocomplete.isLoading && (
                  <TouchableOpacity onPress={() => {
                    setDestination('');
                    setDestinationPlaceId(null);
                    setDestinationDetails(null);
                    destinationAutocomplete.clearSuggestions();
                  }}>
                    <Ionicons name="close-circle" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLocations}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="swap-vertical" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {originFocused && originAutocomplete.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <FlatList
              data={originAutocomplete.suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderSuggestion(item, selectOrigin, originAutocomplete.isLoading)}
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled" 
            />
          </View>
        )}

        {destinationFocused && destinationAutocomplete.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <FlatList
              data={destinationAutocomplete.suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderSuggestion(item, selectDestination, destinationAutocomplete.isLoading)}
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled" 
            />
          </View>
        )}

        {originAutocomplete.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading suggestions. Please try again.</Text>
          </View>
        )}

        {destinationAutocomplete.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading suggestions. Please try again.</Text>
          </View>
        )}

        {!originFocused && !destinationFocused && recentLocations.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recent Locations</Text>
            {recentLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.recentItem}
                onPress={() => selectRecentLocation(location, !origin || origin.length === 0)}
              >
                <View style={styles.recentIcon}>
                  <Ionicons name="time-outline" size={20} color="#8E8E93" />
                </View>
                <View style={styles.recentText}>
                  <Text style={styles.recentName}>{location.name}</Text>
                  <Text style={styles.recentAddress}>{location.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!originDetails || !destinationDetails) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmBooking}
          disabled={!originDetails || !destinationDetails}
        >
          <Text style={styles.confirmButtonText}>Confirm Locations</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotContainer: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 20,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
  },
  connector: {
    width: 2,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginVertical: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  inputsWrapper: {
    flex: 1,
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1D1D1F',
  },
  inputFocused: {
    borderColor: '#007AFF',
  },
  swapButton: {
    marginLeft: 8,
    padding: 8,
    marginTop: 32,
  },
  suggestionsContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#8E8E93',
  },
  errorContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  recentContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentText: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  recentAddress: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    padding: 24,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});