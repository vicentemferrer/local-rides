import { useDestinationSearch } from '@/hooks/useDestinationSearch';
import { getPlaceDetails } from '@/src/core/api/placesService';
import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { mockPlaceDetails, mockPlacePredictions } from './__mocks__/mockData';

// fake dependencies
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googlePlacesApiKey: 'test-api-key'
    }
  }
}));
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));
jest.mock('@/src/core/api/placesService');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));


const mockGetPlaceDetails = getPlaceDetails as jest.MockedFunction<typeof getPlaceDetails>;

describe('useDestinationSearch', () => {
  beforeEach(() => jest.clearAllMocks());

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useDestinationSearch());
    expect(result.current.input).toBe('');
    expect(result.current.showSuggestions).toBe(false);
    expect(result.current.predictions).toEqual([]);
  });

  it('updates input correctly', () => {
    const { result } = renderHook(() => useDestinationSearch());
    act(() => result.current.setInput('New York'));
    expect(result.current.input).toBe('New York');
  });

  it('handles successful place selection', async () => {
    const mockPlace = mockPlacePredictions[0];
    mockGetPlaceDetails.mockResolvedValue(mockPlaceDetails);
    const { result } = renderHook(() => useDestinationSearch());
    
    await act(async () => result.current.handlePlaceSelect(mockPlace));
    
    expect(result.current.input).toBe('New York, NY, USA');
    expect(Alert.alert).toHaveBeenCalledWith('Destination Selected', 
      `You selected: New York\nAddress: New York, NY, USA`, 
      [{ text: 'OK', onPress: expect.any(Function) }]);
  });

  it('handles place selection errors', async () => {
    const mockPlace = { place_id: 'invalid', description: 'Invalid', structured_formatting: { main_text: 'Invalid', secondary_text: '' } };
    mockGetPlaceDetails.mockRejectedValue(new Error('API Error'));
    const { result } = renderHook(() => useDestinationSearch());
    
    await act(async () => result.current.handlePlaceSelect(mockPlace));

    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to get place details. Please try again.');
  });
});
