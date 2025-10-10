
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
  it('should fetch place predictions successfully', async () => {
  });
});
