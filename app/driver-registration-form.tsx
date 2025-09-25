import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/core/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DriverRegistrationForm } from '@/src/Styles/drivers';

export default function DriverRegistrationFormScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signupDriver } = useAuth();
  
  const [formData, setFormData] = useState<DriverRegistrationForm>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userType: 'driver'
    },
    licenseInfo: {
      licenseNumber: '',
      expirationDate: '',
      state: '',
    },
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      color: '',
      licensePlate: '',
    },
    documents: {
      license: 'uploaded', // Mock uploaded state
      insurance: 'uploaded',
      registration: 'uploaded',
    },
  });

  const updateFormData = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await signupDriver(formData);
      Alert.alert(
        'Registration Successful!',
        'Welcome to Local Rides! Your driver account is now active.',
        [{ text: 'Get Started', onPress: () => router.replace('/(app)/(tabs)/home') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
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
        <Text style={styles.headerTitle}>Driver Registration Form</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="First Name"
            value={formData.personalInfo.firstName}
            onChangeText={(text) => updateFormData('personalInfo', 'firstName', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Last Name"
            value={formData.personalInfo.lastName}
            onChangeText={(text) => updateFormData('personalInfo', 'lastName', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#8E8E93"
            value={formData.personalInfo.email}
            onChangeText={(text) => updateFormData('personalInfo', 'email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Phone Number"
            value={formData.personalInfo.phoneNumber}
            onChangeText={(text) => updateFormData('personalInfo', 'phoneNumber', text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* License Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver's License</Text>
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="License Number"
            value={formData.licenseInfo.licenseNumber}
            onChangeText={(text) => updateFormData('licenseInfo', 'licenseNumber', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Expiration Date (MM/YY)"
            value={formData.licenseInfo.expirationDate}
            onChangeText={(text) => updateFormData('licenseInfo', 'expirationDate', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="State Issued"
            value={formData.licenseInfo.state}
            onChangeText={(text) => updateFormData('licenseInfo', 'state', text)}
          />
        </View>

        {/* Vehicle Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Make (e.g., Toyota)"
            value={formData.vehicleInfo.make}
            onChangeText={(text) => updateFormData('vehicleInfo', 'make', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Model (e.g., Camry)"
            value={formData.vehicleInfo.model}
            onChangeText={(text) => updateFormData('vehicleInfo', 'model', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Year (e.g., 2020)"
            value={formData.vehicleInfo.year}
            onChangeText={(text) => updateFormData('vehicleInfo', 'year', text)}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93"
            placeholder="Color"
            value={formData.vehicleInfo.color}
            onChangeText={(text) => updateFormData('vehicleInfo', 'color', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E8E93" 
            placeholder="License Plate"
            value={formData.vehicleInfo.licensePlate}
            onChangeText={(text) => updateFormData('vehicleInfo', 'licensePlate', text.toUpperCase())}
          />
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          
          <View style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Driver's License</Text>
              <Text style={styles.documentSubtitle}>Clear photo of front and back</Text>
            </View>
            <View style={styles.documentStatus}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            </View>
          </View>
          
          <View style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Vehicle Insurance</Text>
              <Text style={styles.documentSubtitle}>Current insurance card</Text>
            </View>
            <View style={styles.documentStatus}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            </View>
          </View>
          
          <View style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Vehicle Registration</Text>
              <Text style={styles.documentSubtitle}>Current vehicle registration</Text>
            </View>
            <View style={styles.documentStatus}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            </View>
          </View>
        </View>

        {/* Background Check Notice */}
        <View style={styles.noticeBox}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Background Check Required</Text>
            <Text style={styles.noticeText}>
              All drivers must pass a background check before being approved to drive. This process typically takes 1-3 business days.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>

        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By submitting this application, you agree to our Terms of Service and Privacy Policy. 
            You also consent to background and driving record checks.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1D1D1F' },
  content: { flex: 1, paddingHorizontal: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 16 },
  input: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#E5E5EA' 
  },
  documentItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12 
  },
  documentInfo: { flex: 1 },
  documentTitle: { fontSize: 16, fontWeight: '600', color: '#1D1D1F', marginBottom: 4 },
  documentSubtitle: { fontSize: 14, color: '#8E8E93' },
  documentStatus: { marginLeft: 12 },
  noticeBox: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F8FF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#B3D9FF'
  },
  noticeContent: { marginLeft: 12, flex: 1 },
  noticeTitle: { fontSize: 16, fontWeight: '600', color: '#1D4ED8', marginBottom: 4 },
  noticeText: { fontSize: 14, color: '#1D4ED8', lineHeight: 20 },
  submitButton: { 
    backgroundColor: '#34C759', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginBottom: 24 
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  termsSection: { paddingBottom: 32 },
  termsText: { 
    fontSize: 12, 
    color: '#8E8E93', 
    textAlign: 'center', 
    lineHeight: 18 
  },
});