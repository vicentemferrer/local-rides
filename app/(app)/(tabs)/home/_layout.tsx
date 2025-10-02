import { LocationProvider } from '@/src/core/context/LocationContext';
import { Stack } from 'expo-router';

export default function HomeLayout() {
	return (
		<LocationProvider>
			<Stack>
				<Stack.Screen
					name='index'
					options={{
						headerShown: false,
						title: 'Home'
					}}
				/>

				<Stack.Screen
					name='booking'
					options={{
						title: 'Book a Ride',
						headerBackVisible: false,
						headerLargeTitle: false
						//headerBackTitleVisible: false,
					}}
				/>
				<Stack.Screen
					name='ride-tracking'
					options={{
						title: 'Your Ride',
						headerBackVisible: false,
						headerLargeTitle: false,
						//headerBackTitleVisible: false,
						gestureEnabled: false
					}}
				/>
				<Stack.Screen
					name='destination'
					options={{
						title: 'Where to?',
						headerBackVisible: false,
						headerLargeTitle: false
						//headerBackTitleVisible: false,
					}}
				/>
				<Stack.Screen
					name='payment'
					options={{
						title: 'Payment',
						headerBackVisible: false,
						headerLargeTitle: false
						//headerBackTitleVisible: false,
					}}
				/>
			</Stack>
		</LocationProvider>
	);
}
