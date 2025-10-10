import { getPlaceDetails, getPlacePredictions } from '@/src/core/api/placesService';

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

