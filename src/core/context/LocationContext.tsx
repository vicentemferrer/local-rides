import { useLocation } from '@/hooks/useLocation';
import { LocationObject } from 'expo-location';
import React, { createContext, ReactNode, useContext } from 'react';
import { Region } from 'react-native-maps';

interface LocUtils {
	location: LocationObject;
	region: Region;
	locationError: string | null;
}

interface Props {
	children: ReactNode;
}

const LocationContext = createContext<LocUtils>({} as LocUtils);

export function LocationProvider({ children }: Props) {
	const { location, region, locationError } = useLocation();

	return (
		<LocationContext.Provider
			value={{
				location,
				region,
				locationError
			}}>
			{children}
		</LocationContext.Provider>
	);
}

export function useLocationContext() {
	const context = useContext(LocationContext);
	if (!context) {
		throw new Error('useLocationContext must be used within an LocationProvider');
	}
	return context;
}
