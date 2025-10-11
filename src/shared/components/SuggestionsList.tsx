import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PlacePrediction } from '@/src/core/api/placesService';

interface SuggestionsListProps {
  predictions: PlacePrediction[];
  onSelect: (place: PlacePrediction) => void;
}

export function SuggestionsList({ predictions, onSelect }: SuggestionsListProps) {
  const renderItem = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
      <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
      <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={predictions}
      renderItem={renderItem}
      keyExtractor={(item) => item.place_id}
      style={styles.list}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 8,
    maxHeight: 200,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  mainText: { fontSize: 16, fontWeight: '500', color: '#000000' },
  secondaryText: { fontSize: 14, color: '#8E8E93', marginTop: 2 },
});
