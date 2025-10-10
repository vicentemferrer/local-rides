import { SuggestionsList } from '@/src/shared/components/SuggestionsList';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { mockPlacePredictions } from './__mocks__/mockData';

describe('SuggestionsList', () => {
  it('renders predictions with main and secondary text', () => {
    const { getByText } = render(
      <SuggestionsList predictions={mockPlacePredictions} onSelect={jest.fn()} />
    );
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('NY, USA')).toBeTruthy();
    expect(getByText('Newark')).toBeTruthy();
    expect(getByText('NJ, USA')).toBeTruthy();
  });

  it('calls onSelect when prediction is tapped', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <SuggestionsList predictions={mockPlacePredictions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('New York'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockPlacePredictions[0]);
  });

  it('renders empty list when no predictions', () => {
    const { queryByText } = render(
      <SuggestionsList predictions={[]} onSelect={jest.fn()} />
    );
    expect(queryByText('New York')).toBeFalsy();
  });

  it('handles multiple selections', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <SuggestionsList predictions={mockPlacePredictions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('New York'));
    fireEvent.press(getByText('Newark'));
    
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect).toHaveBeenNthCalledWith(1, mockPlacePredictions[0]);
    expect(mockOnSelect).toHaveBeenNthCalledWith(2, mockPlacePredictions[1]);
  });

 
