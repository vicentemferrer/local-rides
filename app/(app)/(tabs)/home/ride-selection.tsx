import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { decodePolyline, getDirections, RouteInfo } from '@/src/core/location/directionsService';

export default function RideSelectionScreen() {
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getParamAsString = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) {
      return param[0] ?? '';
    }
    return param ?? '';
  };

  const origin = {
    lat: parseFloat(getParamAsString(params.originLat)),
    lng: parseFloat(getParamAsString(params.originLng)),
    name: getParamAsString(params.originName),
    address: getParamAsString(params.originAddress),
  };

  const destination = {
    lat: parseFloat(getParamAsString(params.destLat)),
    lng: parseFloat(getParamAsString(params.destLng)),
    name: getParamAsString(params.destName),
    address: getParamAsString(params.destAddress),
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    setIsLoadingRoute(true);
    setError(null);
    
    try {
      const route = await getDirections(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng }
      );

      if (route) {
        setRouteInfo(route);
        const decoded = decodePolyline(route.polyline);
        setRouteCoordinates(decoded);
        
        // Fit map to show the entire route
        setTimeout(() => {
          if (mapRef.current && decoded.length > 0) {
            mapRef.current.fitToCoordinates(decoded, {
              edgePadding: { top: 112, right: 30, bottom: 115, left: 30 },
              animated: true,
            });
          }
        }, 500);
      } else {
        setError('Unable to find route');
      }
    } catch (err) {
      console.error('Error fetching route:', err);
      setError('Failed to load route. Please try again.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const calculateEstimatedPrice = () => {
    if (!routeInfo) return 0;
    // Simple pricing: $2 base + $1.5 per km
    const distanceKm = routeInfo.distanceValue / 1000;
    return (2 + distanceKm * 1.5).toFixed(2);
  };

  const handleConfirmRide = () => {
    // For now, go back to home
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (origin.lat + destination.lat) / 2,
            longitude: (origin.lng + destination.lng) / 2,
            latitudeDelta: Math.abs(origin.lat - destination.lat) * 2 || 0.03,
            longitudeDelta: Math.abs(origin.lng - destination.lng) * 2 || 0.03,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Origin Marker */}
          <Marker
            coordinate={{ latitude: origin.lat, longitude: origin.lng }}
            title={origin.name}
            description={origin.address}
            pinColor="#34C759"
          />

          {/* Destination Marker */}
          <Marker
            coordinate={{ latitude: destination.lat, longitude: destination.lng }}
            title={destination.name}
            description={destination.address}
            pinColor="#FF3B30"
          />

          {/* Route Polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#007AFF"
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1D1D1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Ride</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Loading Overlay */}
        {isLoadingRoute && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Finding best route...</Text>
            </View>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View style={styles.errorOverlay}>
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={48} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchRoute}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />

        {/* Route Info */}
        {routeInfo && (
          <View style={styles.routeInfoContainer}>
            <View style={styles.routeInfoRow}>
              <View style={styles.routeInfoItem}>
                <Ionicons name="time-outline" size={20} color="#8E8E93" />
                <Text style={styles.routeInfoLabel}>Duration</Text>
                <Text style={styles.routeInfoValue}>{routeInfo.duration}</Text>
              </View>
              <View style={styles.routeInfoDivider} />
              <View style={styles.routeInfoItem}>
                <Ionicons name="navigate-outline" size={20} color="#8E8E93" />
                <Text style={styles.routeInfoLabel}>Distance</Text>
                <Text style={styles.routeInfoValue}>{routeInfo.distance}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Locations */}
        <View style={styles.locationsContainer}>
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, { backgroundColor: '#34C759' }]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{origin.name}</Text>
              <Text style={styles.locationAddress}>{origin.address}</Text>
            </View>
          </View>

          <View style={styles.locationConnector} />

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, { backgroundColor: '#FF3B30' }]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{destination.name}</Text>
              <Text style={styles.locationAddress}>{destination.address}</Text>
            </View>
          </View>
        </View>

        {/* Price and Confirm */}
        {routeInfo && (
          <View style={styles.priceContainer}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Estimated Fare</Text>
              <Text style={styles.priceValue}>${calculateEstimatedPrice()}</Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmRide}
            >
              <Text style={styles.confirmButtonText}>Confirm Ride</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  placeholder: {
    width: 40,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  routeInfoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  routeInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  routeInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  routeInfoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginTop: 2,
  },
  locationsContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#8E8E93',
  },
  locationConnector: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E5EA',
    marginLeft: 5,
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 12,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});