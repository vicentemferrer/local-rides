import { SearchBar } from '@/src/shared/components/SearchBar';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('SearchBar', () => {
  it('renders with placeholder and value', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <SearchBar value="New York" onChangeText={jest.fn()} placeholder="Search..." />
    );
    expect(getByPlaceholderText('Search...')).toBeTruthy();
    expect(getByDisplayValue('New York')).toBeTruthy();
  });
});