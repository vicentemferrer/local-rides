// import { Ionicons } from '@expo/vector-icons';
// import React from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDriverProfile } from '../hooks/useDriverProfile';
// import { useSupabaseAuth } from '../src/core/context/SupabaseAuthContext';

// export default function DriverProfileScreen() {
//   const { user } = useSupabaseAuth();
//   const { 
//     profile, 
//     loading, 
//     error, 
//     hasProfile, 
//     profileCompletion,
//     fetchProfile 
//   } = useDriverProfile();

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.loadingText}>Loading profile...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Ionicons name="alert-circle" size={48} color="#FF3B30" />
//           <Text style={styles.errorTitle}>Error Loading Profile</Text>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!hasProfile) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.noProfileContainer}>
//           <Ionicons name="person-add" size={48} color="#8E8E93" />
//           <Text style={styles.noProfileTitle}>No Driver Profile Found</Text>
//           <Text style={styles.noProfileText}>
//             You haven't completed your driver registration yet.
//           </Text>
//           <TouchableOpacity 
//             style={styles.registerButton}
//             onPress={() => {
//               // Navigate to registration form
//               Alert.alert('Registration', 'Please complete the driver registration form first.');
//             }}
//           >
//             <Text style={styles.registerButtonText}>Complete Registration</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Driver Profile</Text>
//           <View style={styles.completionBadge}>
//             <Text style={styles.completionText}>
//               {Math.round(profileCompletion)}% Complete
//             </Text>
//           </View>
//         </View>

//         {/* Personal Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Personal Information</Text>
//           <View style={styles.infoCard}>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Name:</Text>
//               <Text style={styles.infoValue}>
//                 {profile?.driver.first_name} {profile?.driver.last_name}
//               </Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Email:</Text>
//               <Text style={styles.infoValue}>{profile?.driver.email}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Phone:</Text>
//               <Text style={styles.infoValue}>{profile?.driver.phone_number}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Status:</Text>
//               <View style={styles.statusContainer}>
//                 <View style={[
//                   styles.statusBadge, 
//                   profile?.driver.is_active ? styles.activeBadge : styles.inactiveBadge
//                 ]}>
//                   <Text style={[
//                     styles.statusText,
//                     profile?.driver.is_active ? styles.activeText : styles.inactiveText
//                   ]}>
//                     {profile?.driver.is_active ? 'Active' : 'Inactive'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* License Information */}
//         {profile?.license && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Driver's License</Text>
//             <View style={styles.infoCard}>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>License Number:</Text>
//                 <Text style={styles.infoValue}>{profile.license.license_number}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Expiry Date:</Text>
//                 <Text style={styles.infoValue}>{profile.license.license_expiry}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>State:</Text>
//                 <Text style={styles.infoValue}>{profile.license.license_state}</Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Vehicle Information */}
//         {profile?.vehicles && profile.vehicles.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Vehicle Information</Text>
//             {profile.vehicles.map((vehicle, index) => (
//               <View key={vehicle.id} style={styles.infoCard}>
//                 <Text style={styles.vehicleTitle}>Vehicle {index + 1}</Text>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Make/Model:</Text>
//                   <Text style={styles.infoValue}>{vehicle.make} {vehicle.model}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Year:</Text>
//                   <Text style={styles.infoValue}>{vehicle.year}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Color:</Text>
//                   <Text style={styles.infoValue}>{vehicle.color}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>License Plate:</Text>
//                   <Text style={styles.infoValue}>{vehicle.license_plate}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Type:</Text>
//                   <Text style={styles.infoValue}>{vehicle.vehicle_type}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Capacity:</Text>
//                   <Text style={styles.infoValue}>{vehicle.seating_capacity} seats</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Document Status */}
//         {profile?.documents && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Document Status</Text>
//             <View style={styles.infoCard}>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Driver's License:</Text>
//                 <View style={styles.statusContainer}>
//                   <View style={[
//                     styles.statusBadge,
//                     getDocumentStatusStyle(profile.documents.license_status)
//                   ]}>
//                     <Text style={[
//                       styles.statusText,
//                       getDocumentStatusTextStyle(profile.documents.license_status)
//                     ]}>
//                       {profile.documents.license_status}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Insurance:</Text>
//                 <View style={styles.statusContainer}>
//                   <View style={[
//                     styles.statusBadge,
//                     getDocumentStatusStyle(profile.documents.insurance_status)
//                   ]}>
//                     <Text style={[
//                       styles.statusText,
//                       getDocumentStatusTextStyle(profile.documents.insurance_status)
//                     ]}>
//                       {profile.documents.insurance_status}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Registration:</Text>
//                 <View style={styles.statusContainer}>
//                   <View style={[
//                     styles.statusBadge,
//                     getDocumentStatusStyle(profile.documents.registration_status)
//                   ]}>
//                     <Text style={[
//                       styles.statusText,
//                       getDocumentStatusTextStyle(profile.documents.registration_status)
//                     ]}>
//                       {profile.documents.registration_status}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Action Buttons */}
//         <View style={styles.actionsSection}>
//           <TouchableOpacity style={styles.editButton}>
//             <Ionicons name="pencil" size={20} color="#007AFF" />
//             <Text style={styles.editButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.refreshButton} onPress={fetchProfile}>
//             <Ionicons name="refresh" size={20} color="#34C759" />
//             <Text style={styles.refreshButtonText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Helper function to get document status styling
// const getDocumentStatusStyle = (status: string) => {
//   switch (status) {
//     case 'uploaded':
//       return styles.uploadedBadge;
//     case 'pending':
//       return styles.pendingBadge;
//     case 'missing':
//       return styles.missingBadge;
//     default:
//       return styles.missingBadge;
//   }
// };

// const getDocumentStatusTextStyle = (status: string) => {
//   switch (status) {
//     case 'uploaded':
//       return styles.uploadedText;
//     case 'pending':
//       return styles.pendingText;
//     case 'missing':
//       return styles.missingText;
//     default:
//       return styles.missingText;
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#8E8E93',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   errorTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1D1D1F',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#8E8E93',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   noProfileContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   noProfileTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1D1D1F',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   noProfileText: {
//     fontSize: 16,
//     color: '#8E8E93',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   registerButton: {
//     backgroundColor: '#34C759',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   registerButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1D1D1F',
//   },
//   completionBadge: {
//     backgroundColor: '#F0F8FF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   completionText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#007AFF',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1D1D1F',
//     marginBottom: 12,
//   },
//   infoCard: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#8E8E93',
//     flex: 1,
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#1D1D1F',
//     flex: 2,
//     textAlign: 'right',
//   },
//   vehicleTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1D1D1F',
//     marginBottom: 12,
//   },
//   statusContainer: {
//     flex: 2,
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   activeBadge: {
//     backgroundColor: '#D4F7D4',
//   },
//   activeText: {
//     color: '#34C759',
//   },
//   inactiveBadge: {
//     backgroundColor: '#FFE5E5',
//   },
//   inactiveText: {
//     color: '#FF3B30',
//   },
//   uploadedBadge: {
//     backgroundColor: '#D4F7D4',
//   },
//   uploadedText: {
//     color: '#34C759',
//   },
//   pendingBadge: {
//     backgroundColor: '#FFF3CD',
//   },
//   pendingText: {
//     color: '#FF9500',
//   },
//   missingBadge: {
//     backgroundColor: '#FFE5E5',
//   },
//   missingText: {
//     color: '#FF3B30',
//   },
//   actionsSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 32,
//   },
//   editButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F8FF',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//     justifyContent: 'center',
//   },
//   editButtonText: {
//     color: '#007AFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   refreshButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0FFF0',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginLeft: 8,
//     justifyContent: 'center',
//   },
//   refreshButtonText: {
//     color: '#34C759',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

