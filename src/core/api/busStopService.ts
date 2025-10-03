import { Tables } from '@/types/database.types';

type BusStop = Tables<'bus_stops'>;

export interface BusStopWithDistance extends BusStop {
  distance: number;
}
