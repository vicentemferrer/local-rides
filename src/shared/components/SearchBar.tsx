import React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder = "Search...", isLoading }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {isLoading && (
        <ActivityIndicator size="small" color="#007AFF" style={styles.loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  input: {
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    paddingRight: 40,
  },
  loading: { position: 'absolute', right: 12, top: 12 },
});
