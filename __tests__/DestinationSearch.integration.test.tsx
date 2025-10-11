import { getPlaceDetails, getPlacePredictions } from "@/src/core/api/placesService";
import { fireEvent } from "@testing-library/react-native";
import { mockPlaceDetails, mockPlacePredictions } from "./__mocks__/mockData";

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
    
    // verify SearchBar renders logic
    expect(getByPlaceholderText('Search for a place...')).toBeTruthy();
    
    // verify SuggestionsList renders logic
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('NY, USA')).toBeTruthy();
  });

  it('handles complete search flow with API integration', async () => {
    mockGetPlacePredictions.mockResolvedValue(mockPlacePredictions);
    mockGetPlaceDetails.mockResolvedValue(mockPlaceDetails);

    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <>
        <SearchBar 
          value="" 
          onChangeText={mockOnChange} 
          placeholder="Search for a place..." 
        />
        <SuggestionsList 
          predictions={mockPlacePredictions} 
          onSelect={mockOnSelect} 
        />
      </>
    );

       // simulate user typing
       const searchInput = getByPlaceholderText('Search for a place...');
       fireEvent.changeText(searchInput, 'New York');
       
       // verify onChange was called
       expect(mockOnChange).toHaveBeenCalledWith('New York');
       
       // simulate selecting a suggestion
       fireEvent.press(getByText('New York'));
   
       // verify onSelect was called with correct data
       expect(mockOnSelect).toHaveBeenCalledWith(mockPlacePredictions[0]);
     });
   
 });