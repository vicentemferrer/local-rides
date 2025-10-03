import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for autocomplete suggestions
const POPULAR_LOCATIONS = [
  { id: '1', name: 'San Francisco Airport', address: 'San Francisco, CA 94128' },
  { id: '2', name: 'Downtown San Francisco', address: 'Market St, San Francisco, CA' },
  { id: '3', name: 'Golden Gate Bridge', address: 'Golden Gate Bridge, San Francisco, CA' },
  { id: '4', name: 'Union Square', address: 'Union Square, San Francisco, CA 94108' },
  { id: '5', name: 'Fisherman\'s Wharf', address: 'Fisherman\'s Wharf, San Francisco, CA' },
  { id: '6', name: 'Chinatown', address: 'Chinatown, San Francisco, CA 94108' },
  { id: '7', name: 'Mission District', address: 'Mission District, San Francisco, CA' },
  { id: '8', name: 'Stanford University', address: 'Stanford, CA 94305' },
];

export default function BookingScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originFocused, setOriginFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<typeof POPULAR_LOCATIONS>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<typeof POPULAR_LOCATIONS>([]);

  const handleOriginChange = (text: string) => {
    setOrigin(text);
    if (text.length > 0) {
      const filtered = POPULAR_LOCATIONS.filter(
        (location) =>
          location.name.toLowerCase().includes(text.toLowerCase()) ||
          location.address.toLowerCase().includes(text.toLowerCase())
      );
      setOriginSuggestions(filtered);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = (text: string) => {
    setDestination(text);
    if (text.length > 0) {
      const filtered = POPULAR_LOCATIONS.filter(
        (location) =>
          location.name.toLowerCase().includes(text.toLowerCase()) ||
          location.address.toLowerCase().includes(text.toLowerCase())
      );
      setDestinationSuggestions(filtered);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const selectOrigin = (location: typeof POPULAR_LOCATIONS[0]) => {
    setOrigin(location.name);
    setOriginSuggestions([]);
    Keyboard.dismiss();
  };

  const selectDestination = (location: typeof POPULAR_LOCATIONS[0]) => {
    setDestination(location.name);
    setDestinationSuggestions([]);
    Keyboard.dismiss();
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleConfirmBooking = () => {
    if (origin && destination) {
      // Navigate to ride selection or confirmation page
      console.log('Booking:', { origin, destination });
      router.push('/'); // Replace with your ride selection route
    }
  };

  const renderSuggestion = (
    item: typeof POPULAR_LOCATIONS[0],
    onSelect: (location: typeof POPULAR_LOCATIONS[0]) => void
  ) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onSelect(item)}
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
                {origin.length > 0 && (
                  <TouchableOpacity onPress={() => setOrigin('')}>
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
                {destination.length > 0 && (
                  <TouchableOpacity onPress={() => setDestination('')}>
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

        {originFocused && originSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <FlatList
              data={originSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderSuggestion(item, selectOrigin)}
              scrollEnabled={false}
            />
          </View>
        )}

        {destinationFocused && destinationSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <FlatList
              data={destinationSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderSuggestion(item, selectDestination)}
              scrollEnabled={false}
            />
          </View>
        )}

        {!originFocused && !destinationFocused && (
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recent Locations</Text>
            {POPULAR_LOCATIONS.slice(0, 3).map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.recentItem}
                onPress={() => {
                  if (!origin) {
                    selectOrigin(location);
                  } else {
                    selectDestination(location);
                  }
                }}
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
            (!origin || !destination) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmBooking}
          disabled={!origin || !destination}
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