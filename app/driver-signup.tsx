import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
  { title: 'Personal Info', description: 'Basic information' },
  { title: 'License', description: 'Driver\'s license details' },
  { title: 'Vehicle', description: 'Vehicle information' },
  { title: 'Documents', description: 'Upload documents' },
  { title: 'Review', description: 'Review and submit' },
];

export default function DriverSignupScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => currentStep === 0 ? router.back() : prevStep()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Registration</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / STEPS.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 0 && <PersonalInfoStep onNext={nextStep} />}
        {currentStep === 1 && <LicenseInfoStep onNext={nextStep} />}
        {currentStep === 2 && <VehicleInfoStep onNext={nextStep} />}
        {currentStep === 3 && <DocumentsStep onNext={nextStep} />}
        {currentStep === 4 && <ReviewStep />}
      </ScrollView>
    </SafeAreaView>
  );
}

// Step Components
const PersonalInfoStep = ({ onNext }: { onNext: () => void }) => (
  <View style={stepStyles.container}>
    <Text style={stepStyles.title}>Personal Information</Text>
    <Text style={stepStyles.subtitle}>Tell us a bit about yourself</Text>
    
    <TouchableOpacity style={stepStyles.button} onPress={onNext}>
      <Text style={stepStyles.buttonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const LicenseInfoStep = ({ onNext }: { onNext: () => void }) => (
  <View style={stepStyles.container}>
    <Text style={stepStyles.title}>Driver's License</Text>
    <Text style={stepStyles.subtitle}>We need to verify your license</Text>
    
    <TouchableOpacity style={stepStyles.button} onPress={onNext}>
      <Text style={stepStyles.buttonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const VehicleInfoStep = ({ onNext }: { onNext: () => void }) => (
  <View style={stepStyles.container}>
    <Text style={stepStyles.title}>Vehicle Information</Text>
    <Text style={stepStyles.subtitle}>Tell us about your vehicle</Text>
    
    <TouchableOpacity style={stepStyles.button} onPress={onNext}>
      <Text style={stepStyles.buttonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const DocumentsStep = ({ onNext }: { onNext: () => void }) => (
  <View style={stepStyles.container}>
    <Text style={stepStyles.title}>Required Documents</Text>
    <Text style={stepStyles.subtitle}>Upload necessary documents</Text>
    
    <TouchableOpacity style={stepStyles.button} onPress={onNext}>
      <Text style={stepStyles.buttonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const ReviewStep = () => (
  <View style={stepStyles.container}>
    <Text style={stepStyles.title}>Review & Submit</Text>
    <Text style={stepStyles.subtitle}>Please review your information</Text>
    
    <TouchableOpacity 
      style={stepStyles.button} 
      onPress={() => router.push('/driver-registration-form')}
    >
      <Text style={stepStyles.buttonText}>Start Detailed Registration</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1D1D1F' },
  progressContainer: { paddingHorizontal: 24, paddingBottom: 24 },
  progressBar: { height: 4, backgroundColor: '#E5E5EA', borderRadius: 2, marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#34C759', borderRadius: 2 },
  progressText: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: 24 },
});

const stepStyles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 40, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1D1D1F', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#34C759', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 32, minWidth: 200 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});