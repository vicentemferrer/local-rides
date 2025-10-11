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

     it('handles loading state integration', () => {
        const mockOnSelect = jest.fn();
        const mockOnChange = jest.fn();
    
        const { getByPlaceholderText } = render(
          <>
            <SearchBar 
              value="Searching..." 
              onChangeText={mockOnChange} 
              placeholder="Search for a place..." 
              isLoading={true}
            />
            <SuggestionsList 
              predictions={[]} 
              onSelect={mockOnSelect} 
            />
          </>
        );
        
          // verify loading state logic
          const searchInput = getByPlaceholderText('Search for a place...');
          expect(searchInput.props.value).toBe('Searching...');
        });
      
        it('handles empty suggestions gracefully', () => {
          const mockOnSelect = jest.fn();
          const mockOnChange = jest.fn();
      
          const { getByPlaceholderText, queryByText } = render(
            <>
              <SearchBar 
                value="No results" 
                onChangeText={mockOnChange} 
                placeholder="Search for a place..." 
              />
              <SuggestionsList 
                predictions={[]} 
                onSelect={mockOnSelect} 
              />
            </>
          );

        // verify that the search bar still works
        expect(getByPlaceholderText('Search for a place...')).toBeTruthy();
        
        // verify no suggestions are shown
        expect(queryByText('New York')).toBeFalsy();
           });
         
           it('handles API error scenarios', async () => {
             mockGetPlacePredictions.mockRejectedValue(new Error('API Error'));
         
             const mockOnSelect = jest.fn();
             const mockOnChange = jest.fn();
         
             const { getByPlaceholderText } = render(
               <>
                 <SearchBar 
                   value="" 
                   onChangeText={mockOnChange} 
                   placeholder="Search for a place..." 
                 />
                 <SuggestionsList 
                   predictions={[]} 
                   onSelect={mockOnSelect} 
                 />
               </>
             );
             
             // Verify components still render even with API errors
             expect(getByPlaceholderText('Search for a place...')).toBeTruthy();
           });

           it('maintains component state consistency', () => {
            const mockOnSelect = jest.fn();
            const mockOnChange = jest.fn();
        
            const { getByPlaceholderText, getByText } = render(
              <>
                <SearchBar 
                  value="Central Park" 
                  onChangeText={mockOnChange} 
                  placeholder="Search for a place..." 
                />
                <SuggestionsList 
                  predictions={mockPlacePredictions} 
                  onSelect={mockOnSelect} 
                />
              </>
            );
            
            // Verify consistent state
            const searchInput = getByPlaceholderText('Search for a place...');
            expect(searchInput.props.value).toBe('Central Park');
            expect(getByText('New York')).toBeTruthy();
          });
        });
        
     
      
 });