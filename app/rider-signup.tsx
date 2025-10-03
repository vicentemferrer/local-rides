import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/src/Styles/drivers';
import { useAuth } from '@/hooks/useAuth';

export default function RiderSignupScreen() {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
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

  const updateFormData = <K extends keyof User>(field: K, value: User[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rider Registration</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome to Local Rides!</Text>
          <Text style={styles.subtitle}>Just a few quick details and you're ready to ride</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={RiderRegistration}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>Start Riding</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          <Text style={styles.infoText}>
            As a rider, you'll have instant access to book rides in your area!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1D1D1F' },
  content: { flex: 1, paddingHorizontal: 24 },
  welcomeSection: { paddingVertical: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1D1D1F', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center', lineHeight: 22 },
  form: { marginBottom: 32 },
  input: {color: '#1D1D1F', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  signupButton: { backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  signupButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8FF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#B3D9FF' },
  infoText: { marginLeft: 12, fontSize: 14, color: '#1D4ED8', flex: 1, lineHeight: 20 },
});
