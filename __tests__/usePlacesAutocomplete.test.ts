import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { getPlaceDetails, getPlacePredictions } from '@/src/core/api/placesService';
import { renderHook } from '@testing-library/react-native';

// fake dependencies
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googlePlacesApiKey: 'test-api-key'
    }
  }
}));
jest.mock('@/src/core/api/placesService');

const mockGetPlacePredictions = getPlacePredictions as jest.MockedFunction<typeof getPlacePredictions>;
const mockGetPlaceDetails = getPlaceDetails as jest.MockedFunction<typeof getPlaceDetails>;

describe('usePlacesAutocomplete', () => {
  beforeEach(() => jest.clearAllMocks());

  it('initializes with empty state', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    expect(result.current.predictions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('searches places successfully', async () => {
    mockGetPlacePredictions.mockResolvedValue(mockPlacePredictions);
    const { result } = renderHook(() => usePlacesAutocomplete());
    
    await act(async () => result.current.searchPlaces('New'));
    
    expect(result.current.predictions).toEqual(mockPlacePredictions);
    expect(result.current.isLoading).toBe(false);
  });
 
  });
