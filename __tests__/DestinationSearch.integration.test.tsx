
// fake dependencies
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googlePlacesApiKey: 'test-api-key'
    }
  }
}));
jest.mock('@/src/core/api/placesService');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
}));

// fake functions
const mockGetPlaceDetails = getPlaceDetails as jest.MockedFunction<typeof getPlaceDetails>;
const mockGetPlacePredictions = getPlacePredictions as jest.MockedFunction<typeof getPlacePredictions>;

describe('Destination Search Integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('integrates SearchBar and SuggestionsList components', () => {
    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <>
        <SearchBar 
          value="New York" 
          onChangeText={mockOnChange} 
          placeholder="Search for a place..." 
        />
        <SuggestionsList 
          predictions={mockPlacePredictions} 
          onSelect={mockOnSelect} 
        />
      </>
    );
    
