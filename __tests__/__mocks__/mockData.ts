export const mockPlacePredictions = [
  {
    place_id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
    description: 'New York, NY, USA',
    structured_formatting: { main_text: 'New York', secondary_text: 'NY, USA' }
  },
  {
    place_id: 'ChIJHQ6aMnBTwokRc-T-3CrcvOE',
    description: 'Newark, NJ, USA',
    structured_formatting: { main_text: 'Newark', secondary_text: 'NJ, USA' }
  }
];

export const mockPlaceDetails = {
  place_id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
  name: 'New York',
  formatted_address: 'New York, NY, USA',
  geometry: { location: { lat: 40.7128, lng: -74.0060 } },
  address_components: [{ long_name: 'New York', short_name: 'NY', types: ['locality', 'political'] }]
};
