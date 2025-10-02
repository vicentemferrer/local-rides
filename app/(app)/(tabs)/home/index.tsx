import { useAuth } from '@/hooks/useAuth';
import { useLocationContext } from '@/src/core/context/LocationContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	const { user } = useAuth();

	const { location, region } = useLocationContext();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.greeting}>
					{user?.userType == 'driver' ? `Hello, ${user?.firstName}!` : `Welcome!`}
				</Text>
				<Text style={styles.subtitle}>Where would you like to go?</Text>
			</View>

			<View style={styles.container}>
				<MapView style={styles.map} region={region}>
					<Marker
						coordinate={{
							latitude: location?.coords?.latitude,
							longitude: location?.coords?.longitude
						}}
						title='My Location'
						description='This is where I am'
					/>
				</MapView>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.bookButton}
					// router.push('/(tabs)/home/booking')}
					onPress={() => router.push('/')}>
					<Text style={styles.bookButtonText}>Book a Ride</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.destinationButton}
					//router.push('/(tabs)/home/destination')}
					onPress={() => router.push('/')}>
					<Text style={styles.destinationButtonText}>Choose Destination</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	map: {
		width: '100%',
		height: '100%'
	},
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	header: {
		padding: 24,
		paddingBottom: 16
	},
	greeting: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1D1D1F',
		marginBottom: 4
	},
	subtitle: {
		fontSize: 16,
		color: '#8E8E93'
	},
	mapPlaceholder: {
		flex: 1,
		margin: 24,
		backgroundColor: '#F8F9FA',
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#E5E5EA',
		borderStyle: 'dashed'
	},
	mapText: {
		fontSize: 32,
		marginBottom: 8
	},
	mapSubtext: {
		fontSize: 16,
		color: '#8E8E93'
	},
	actions: {
		padding: 24,
		gap: 12
	},
	bookButton: {
		backgroundColor: '#007AFF',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center'
	},
	bookButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600'
	},
	destinationButton: {
		backgroundColor: '#F8F9FA',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E5E5EA'
	},
	destinationButtonText: {
		color: '#007AFF',
		fontSize: 16,
		fontWeight: '500'
	}
});
