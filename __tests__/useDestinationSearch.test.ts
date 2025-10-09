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
