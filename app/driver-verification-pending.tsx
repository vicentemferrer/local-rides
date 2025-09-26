import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverVerificationPendingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="hourglass-outline" size={64} color="#FF9500" />
        </View>

        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.subtitle}>
          Thank you for applying to become a driver with Local Rides
        </Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>What happens next?</Text>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Application Received</Text>
              <Text style={styles.timelineSubtitle}>We've received your application</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="time-outline" size={20} color="#FF9500" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Document Review</Text>
              <Text style={styles.timelineSubtitle}>1-2 business days</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#8E8E93" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Background Check</Text>
              <Text style={styles.timelineSubtitle}>2-3 business days</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="car-outline" size={20} color="#8E8E93" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Vehicle Inspection</Text>
              <Text style={styles.timelineSubtitle}>Schedule when ready</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color="#8E8E93" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Approval</Text>
              <Text style={styles.timelineSubtitle}>Start earning!</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            We'll send you email updates at each step of the process. 
            The entire verification typically takes 3-5 business days.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.replace('/(app)/(tabs)/home')}
          >
            <Text style={styles.primaryButtonText}>Continue to App</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => alert('Help Center coming soon!')}
          >
            <Text style={styles.secondaryButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1D1D1F', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#8E8E93', 
    textAlign: 'center', 
    marginBottom: 32, 
    lineHeight: 22 
  },
  statusCard: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24 
  },
  statusTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1D1D1F', 
    marginBottom: 16 
  },
  timelineItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  timelineIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  timelineContent: { flex: 1 },
  timelineTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1D1D1F', 
    marginBottom: 2 
  },
  timelineSubtitle: { fontSize: 14, color: '#8E8E93' },
  infoBox: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F8FF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#B3D9FF'
  },
  infoText: { 
    marginLeft: 12, 
    fontSize: 14, 
    color: '#1D4ED8', 
    flex: 1, 
    lineHeight: 20 
  },
  actions: { gap: 12 },
  primaryButton: { 
    backgroundColor: '#007AFF', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 
  },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  secondaryButton: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA'
  },
  secondaryButtonText: { 
    color: '#007AFF', 
    fontSize: 16, 
    fontWeight: '500' 
  },
});