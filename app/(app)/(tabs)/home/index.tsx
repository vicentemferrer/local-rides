import { useAuth } from '@/hooks/useAuth';
import { useLocationContext } from '@/src/core/context/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	const { user, isLoading } = useAuth();
	const { location, region } = useLocationContext();

  if (isLoading && user == null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingIconContainer}>
              <Ionicons name="car-sport" size={48} color="#007AFF" />
              <ActivityIndicator 
                size="large" 
                color="#007AFF" 
                style={styles.loadingSpinner}
              />
            </View>
            <Text style={styles.loadingTitle}>Loading your ride</Text>
            <Text style={styles.loadingSubtitle}>Please wait a moment...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.greeting}>
					{user?.userType == 'driver' ? `Hello, ${user?.firstName}!` : `Welcome!`}
				</Text>
			</View>

			{user?.userType === 'rider' && (
				<View style={styles.searchBarContainer}>
					<TouchableOpacity
						style={styles.searchBar}
						onPress={() => router.push('/(app)/(tabs)/home/booking')}
						activeOpacity={0.7}>
						<Ionicons name='search' size={20} color='#8E8E93' style={styles.searchIcon} />
						<Text style={styles.searchPlaceholder}>Where are you going?</Text>
					</TouchableOpacity>
				</View>
			)}

			<View style={styles.mapContainer}>
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

			{user?.userType === 'driver' && (
				<View style={styles.actions}>
					<TouchableOpacity style={styles.bookButton} onPress={() => router.push('/')}>
						<Text style={styles.bookButtonText}>Book a Ride</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.destinationButton}
						onPress={() => router.push('/(app)/(tabs)/home/destination')}>
						<Text style={styles.destinationButtonText}>Choose Destination</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	},
	loadingContent: {
		alignItems: 'center',
		paddingHorizontal: 48
	},
	loadingIconContainer: {
		position: 'relative',
		width: 120,
		height: 120,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24
	},
	loadingSpinner: {
		position: 'absolute',
		transform: [{ scale: 1.8 }]
	},
	loadingTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#1D1D1F',
		marginBottom: 8,
		textAlign: 'center'
	},
	loadingSubtitle: {
		fontSize: 16,
		color: '#8E8E93',
		textAlign: 'center'
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
	searchBarContainer: {
		paddingHorizontal: 24,
		paddingBottom: 16
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F8F9FA',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#E5E5EA',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2
	},
	searchIcon: {
		marginRight: 12
	},
	searchPlaceholder: {
		flex: 1,
		fontSize: 16,
		color: '#8E8E93'
	},
	mapContainer: {
		flex: 1
	},
	map: {
		width: '100%',
		height: '100%'
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
