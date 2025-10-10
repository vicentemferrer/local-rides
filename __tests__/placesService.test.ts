import { getPlaceDetails, getPlacePredictions } from '@/src/core/api/placesService';
import { mockPlaceDetails, mockPlacePredictions } from './__mocks__/mockData';

// fake dependencies
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googlePlacesApiKey: 'test-api-key'
    }
  }
}));

// fake fetch
global.fetch = jest.fn();

describe('Places Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getPlacePredictions', () => {
    it('returns predictions for valid input', async () => {
      const mockResponse = {
        predictions: mockPlacePredictions
      };
      (fetch as jest.Mock).mockResolvedValueOnce({ 
        ok: true, 
        json: async () => mockResponse 
      });

      const result = await getPlacePredictions('New York');

      expect(result).toEqual(mockPlacePredictions);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('autocomplete/json')
      );
    });

    it('throws error for failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(getPlacePredictions('Invalid')).rejects.toThrow(
        'Failed to fetch place predictions'
      );
    });

    it('handles empty predictions response', async () => {
      const mockResponse = { predictions: [] };
      (fetch as jest.Mock).mockResolvedValueOnce({ 
        ok: true, 
        json: async () => mockResponse 
      });

      const result = await getPlacePredictions('NonExistentPlace');
      expect(result).toEqual([]);
    });

    it('includes session token when provided', async () => {
      const mockResponse = { predictions: mockPlacePredictions };
      (fetch as jest.Mock).mockResolvedValueOnce({ 
        ok: true, 
        json: async () => mockResponse 
      });

      await getPlacePredictions('New York', 'test-session-token');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sessiontoken=test-session-token')
      );
    });
  });

  });
});
