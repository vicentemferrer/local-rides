import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/src/Styles/drivers';
import { useAuth } from '@/src/core/context/AuthContext';

const { width } = Dimensions.get('window');

export default function UserTypeSelectionScreen() {
  const [formData, setFormData] = useState<User>({
    firstName: ' ',
    lastName: ' ',
    email: ' ',
    phoneNumber: ' ',
    userType: 'rider',
  });
  const { signupRider, isLoading } = useAuth();

  const RiderRegistration = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      Alert.alert('Required Fields', 'Please fill in all fields');
      return;
    }

    try {
      await signupRider(formData);
      router.replace('/(app)/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  const handleRiderSelection = () => {
    //router.push('/rider-signup'); 

    RiderRegistration();
  };

  const handleDriverSelection = () => {
    router.push('/driver-signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join Local Rides</Text>
        <Text style={styles.subtitle}>How do you want to use Local Rides?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={handleRiderSelection}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={48} color="#007AFF" />
            </View>
            <Text style={styles.optionTitle}>I need a ride</Text>
            <Text style={styles.optionDescription}>
              Book rides quickly and safely to your destination
            </Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Quick booking</Text>
              <Text style={styles.benefitItem}>• Safe rides</Text>
              <Text style={styles.benefitItem}>• Instant registration</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleDriverSelection}>
            <View style={styles.iconContainer}>
              <Ionicons name="car" size={48} color="#34C759" />
            </View>
            <Text style={styles.optionTitle}>I want to drive</Text>
            <Text style={styles.optionDescription}>
              Earn money by providing rides in your community
            </Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Flexible schedule</Text>
              <Text style={styles.benefitItem}>• Earn extra income</Text>
              <Text style={styles.benefitItem}>• Help your community</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
    paddingVertical: 10,
  },
  optionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    minHeight: 280,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  benefitsList: {
    alignSelf: 'stretch',
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});