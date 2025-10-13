import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocationTracking } from '../hooks/useLocationTracking';

interface LocationTrackerProps {
	showStatus?: boolean;
	autoStart?: boolean;
}

export const LocationTracker: React.FC<LocationTrackerProps> = ({
	showStatus = true,
	autoStart = false
}) => {
	const { user } = useAuth();
	const { isTracking, startTracking, stopTracking, error } = useLocationTracking();

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (autoStart && user && user.userType === 'driver') {
			handleStartTracking();
		}
	}, [autoStart, user]);

	// Note: onLocationUpdate callback removed since we don't track currentLocation in simplified version

	const handleStartTracking = async () => {
		if (!user || user.userType !== 'driver' || !user.id) {
			Alert.alert('Error', 'Only drivers can use location tracking');
			return;
		}

		setIsLoading(true);
		try {
			const success = await startTracking(user.id);

			if (!success) {
				Alert.alert(
					'Permission Required',
					'Location permission is required for tracking. Please enable it in your device settings.',
					[{ text: 'OK' }]
				);
			}
		} catch (err) {
			console.error('Error starting tracking:', err);
			Alert.alert('Error', 'Failed to start location tracking');
		} finally {
			setIsLoading(false);
		}
	};

	const handleStopTracking = async () => {
		setIsLoading(true);
		try {
			await stopTracking();
		} catch (err) {
			console.error('Error stopping tracking:', err);
			Alert.alert('Error', 'Failed to stop location tracking');
		} finally {
			setIsLoading(false);
		}
	};

	const getStatusColor = () => {
		if (error) return '#FF6B6B';
		if (isTracking) return '#4ECDC4';
		return '#95A5A6';
	};

	const getStatusText = () => {
		if (error) return 'Error';
		if (isTracking) return 'Tracking Active';
		return 'Ready to Start';
	};

	const getStatusIcon = () => {
		if (error) return 'warning';
		if (isTracking) return 'location';
		return 'location-outline';
	};

	if (!user || user.userType !== 'driver') {
		return null;
	}

	return (
		<View style={styles.container}>
			{showStatus && (
				<View style={styles.statusContainer}>
					<View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
					<Text style={styles.statusText}>{getStatusText()}</Text>
					<Ionicons name={getStatusIcon() as any} size={16} color={getStatusColor()} />
				</View>
			)}

			{showStatus && isTracking && (
				<View style={styles.locationInfo}>
					<Text style={styles.locationText}>Location tracking is active</Text>
					<Text style={styles.accuracyText}>Updates every 5 seconds to database</Text>
				</View>
			)}

			<View style={styles.buttonContainer}>
				{!isTracking ? (
					<TouchableOpacity
						style={[styles.button, styles.startButton]}
						onPress={handleStartTracking}
						disabled={isLoading}>
						<Ionicons name='play' size={20} color='white' />
						<Text style={styles.buttonText}>{isLoading ? 'Starting...' : 'Start Tracking'}</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={[styles.button, styles.stopButton]}
						onPress={handleStopTracking}
						disabled={isLoading}>
						<Ionicons name='stop' size={20} color='white' />
						<Text style={styles.buttonText}>{isLoading ? 'Stopping...' : 'Stop Tracking'}</Text>
					</TouchableOpacity>
				)}
			</View>

			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		margin: 16
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12
	},
	statusIndicator: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8
	},
	statusText: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
		color: '#2c3e50'
	},
	locationInfo: {
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
		marginBottom: 12
	},
	locationText: {
		fontSize: 14,
		color: '#34495e',
		fontFamily: 'monospace'
	},
	accuracyText: {
		fontSize: 12,
		color: '#7f8c8d',
		marginTop: 4
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		minWidth: 140,
		justifyContent: 'center'
	},
	startButton: {
		backgroundColor: '#27ae60'
	},
	stopButton: {
		backgroundColor: '#e74c3c'
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8
	},
	errorContainer: {
		marginTop: 12,
		padding: 12,
		backgroundColor: '#ffe6e6',
		borderRadius: 8,
		borderLeftWidth: 4,
		borderLeftColor: '#e74c3c'
	},
	errorText: {
		color: '#c0392b',
		fontSize: 14
	}
});

export default LocationTracker;
