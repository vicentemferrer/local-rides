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
