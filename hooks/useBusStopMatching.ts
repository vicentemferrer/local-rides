import { BusStopWithDistance, findClosestBusStop } from '@/src/core/api/busStopService';
import { PlaceDetails } from '@/src/core/api/placesService';
import { useState } from 'react';

export function useBusStopMatching() {
    const [closestBusStop, setClosestBusStop] = useState<BusStopWithDistance | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const findClosestStopToDestination = async (destination: PlaceDetails) => {
      setIsLoading(true);
      try {
        const closestStop = await findClosestBusStop(
          destination.geometry.location.lat,
          destination.geometry.location.lng
        );
        setClosestBusStop(closestStop);
      } finally {
        setIsLoading(false);
      }
    };
  
    return { closestBusStop, isLoading, findClosestStopToDestination };
  }
  