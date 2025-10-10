import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { getPlaceDetails, getPlacePredictions } from '@/src/core/api/placesService';
import { act, renderHook } from '@testing-library/react-native';

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

  it('handles search errors', async () => {
    mockGetPlacePredictions.mockRejectedValue(new Error('API Error'));
    const { result } = renderHook(() => usePlacesAutocomplete());
    
    await act(async () => result.current.searchPlaces('Invalid'));
    
    expect(result.current.predictions).toEqual([]);
    expect(result.current.error).toBe('API Error');
  });

  it('clears predictions', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    act(() => result.current.clearPredictions());
    expect(result.current.predictions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('gets place details successfully', async () => {
    mockGetPlaceDetails.mockResolvedValue(mockPlaceDetails);
    const { result } = renderHook(() => usePlacesAutocomplete());
    
    let placeDetails;
    await act(async () => { 
      placeDetails = await result.current.getPlaceDetails('test-id'); 
    });
    
    expect(placeDetails).toEqual(mockPlaceDetails);
  });


  });
