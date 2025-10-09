// Simple Node.js test for bus stop service
// Run with: node test-bus-stop-simple.js

// Mock the Supabase client for testing
const mockSupabase = {
  from: (table) => ({
    select: (columns) => ({
      not: (column, operator, value) => ({
        // Mock bus stop data
        data: [
          { id: 'stop-1', bus_id: 'bus-101', latitude: 37.7849, longitude: -122.4094 },
          { id: 'stop-2', bus_id: 'bus-102', latitude: 37.7649, longitude: -122.4294 },
          { id: 'stop-3', bus_id: 'bus-103', latitude: 37.7949, longitude: -122.3994 },
          { id: 'stop-4', bus_id: 'bus-101', latitude: 37.7549, longitude: -122.4094 },
          { id: 'stop-5', bus_id: 'bus-102', latitude: 37.7449, longitude: -122.4494 }
        ],
        error: null
      })
    })
  })
};

// Copy the distance calculation function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Copy the main function
async function findClosestBusStop(destinationLat, destinationLng) {
  const { data: busStops, error } = await mockSupabase
    .from('bus_stops')
    .select('*')
    .not('latitude', 'is', null);

  if (error || !busStops?.length) return null;

  let closestStop = null;
  let minDistance = Infinity;

  for (const stop of busStops) {
    if (stop.latitude !== null) {
      const distance = calculateDistance(destinationLat, destinationLng, stop.latitude, stop.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestStop = { ...stop, distance };
      }
    }
  }

  return closestStop;
}

// Test the function
async function testBusStopService() {
  console.log('🚌 Testing Bus Stop Service (Mock Data)\n');

  const testLocations = [
    { name: 'Union Square', lat: 37.7879, lng: -122.4075 },
    { name: 'Fisherman\'s Wharf', lat: 37.8087, lng: -122.4098 },
    { name: 'Golden Gate Park', lat: 37.7694, lng: -122.4862 }
  ];

  for (const location of testLocations) {
    console.log(`📍 Testing from: ${location.name}`);
    console.log(`   Coordinates: ${location.lat}, ${location.lng}`);
    
    const result = await findClosestBusStop(location.lat, location.lng);
    
    if (result) {
      console.log(`   ✅ Closest bus stop found:`);
      console.log(`      Stop ID: ${result.id}`);
      console.log(`      Bus ID: ${result.bus_id}`);
      console.log(`      Distance: ${result.distance.toFixed(3)} km`);
      console.log(`      Coordinates: ${result.latitude}, ${result.longitude}`);
    } else {
      console.log(`   ❌ No bus stops found`);
    }
    console.log('');
  }

  console.log('🏁 Test completed!');
  console.log('\n💡 If this works, your logic is correct!');
  console.log('   The issue might be with Supabase connection or data.');
}

// Run the test
testBusStopService().catch(console.error);
