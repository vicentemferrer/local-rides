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

  it('calls onChangeText on input change', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChange} placeholder="Search..." />
    );
    
    fireEvent.changeText(getByPlaceholderText('Search...'), 'New York');
    expect(mockOnChange).toHaveBeenCalledWith('New York');
  });

  it('shows loading indicator when loading', () => {
    const { UNSAFE_getByType } = render(
      <SearchBar value="" onChangeText={jest.fn()} isLoading={true} />
    );
    expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
  });

  it('hides loading indicator when not loading', () => {
    const { UNSAFE_queryByType } = render(
      <SearchBar value="" onChangeText={jest.fn()} isLoading={false} />
    );
    expect(UNSAFE_queryByType('ActivityIndicator')).toBeFalsy();
  });

  it('uses default placeholder when none provided', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={jest.fn()} />
    );
    expect(getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('handles multiple text changes', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChange} placeholder="Search..." />
    );
    
    const input = getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'New');
    fireEvent.changeText(input, 'New York');
    fireEvent.changeText(input, 'New York, NY');
    
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, 'New');
    expect(mockOnChange).toHaveBeenNthCalledWith(2, 'New York');
    expect(mockOnChange).toHaveBeenNthCalledWith(3, 'New York, NY');
  });

  it('maintains value when not changed', () => {
    const { getByDisplayValue } = render(
      <SearchBar value="Static Value" onChangeText={jest.fn()} />
    );
    expect(getByDisplayValue('Static Value')).toBeTruthy();
  });
});