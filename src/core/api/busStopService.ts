import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';

type BusStop = Tables<'bus_stops'>;

export interface BusStopWithDistance extends BusStop {
  distance: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function findClosestBusStop(destinationLat: number, destinationLng: number): Promise<BusStopWithDistance | null> {
  const { data: busStops, error } = await supabase
    .from('bus_stops')
    .select('*')
    .not('latitude', 'is', null);

  if (error || !busStops?.length) return null;

  let closestStop: BusStopWithDistance | null = null;
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
