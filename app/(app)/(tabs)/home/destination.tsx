import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { SearchBar } from '@/src/shared/components/SearchBar';
import { SuggestionsList } from '@/src/shared/components/SuggestionsList';
import { useDestinationSearch } from '@/hooks/useDestinationSearch';

export default function DestinationScreen() {
  const {
    input,
    setInput,
    showSuggestions,
    predictions,
    isSearching,
    error,
    handlePlaceSelect,
  } = useDestinationSearch();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Where to?</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Enter your destination</Text>
        
        <SearchBar
          value={input}
          onChangeText={setInput}
          placeholder="Search for a place..."
          isLoading={isSearching}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        {showSuggestions && predictions.length > 0 && (
          <SuggestionsList predictions={predictions} onSelect={handlePlaceSelect} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E1E5E9' },
  backButton: { marginRight: 16 },
  backButtonText: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 20, fontWeight: '600', color: '#000000' },
  content: { flex: 1, padding: 16 },
  subtitle: { fontSize: 16, color: '#8E8E93', marginBottom: 20 },
  errorText: { color: '#FF3B30', fontSize: 12, marginBottom: 10 },
});
