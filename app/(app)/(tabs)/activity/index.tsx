import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock trip data
const MOCK_TRIPS = [
  {
    id: '1',
    date: '2024-01-15',
    from: 'Downtown Plaza',
    to: 'Airport Terminal',
    amount: '$24.50',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-01-14',
    from: 'Home',
    to: 'Mall Center',
    amount: '$12.25',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-01-13',
    from: 'Office Building',
    to: 'Restaurant District',
    amount: '$18.75',
    status: 'completed',
  },
];

export default function ActivityScreen() {
  const { user } = useAuth();

  const renderTripItem = ({ item }: { item: typeof MOCK_TRIPS[0] }) => (
    <TouchableOpacity 
      style={styles.tripItem}
      //onPress={() => router.push(`/(tabs)/activity/trip-detail?id=${item.id}`)}
    >
      <View style={styles.tripInfo}>
        <Text style={styles.tripRoute}>{item.from} → {item.to}</Text>
        <Text style={styles.tripDate}>{item.date}</Text>
      </View>
      <View style={styles.tripMeta}>
        <Text style={styles.tripAmount}>{item.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#34C759' }]}>
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Trips</Text>
        <Text style={styles.subtitle}>Trip history for {user?.firstName}</Text>
      </View>

      <FlatList
        data={MOCK_TRIPS}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tripsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  tripsList: {
    padding: 24,
    paddingTop: 0,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tripMeta: {
    alignItems: 'flex-end',
  },
  tripAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});