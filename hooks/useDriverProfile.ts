import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DriverRegistrationForm } from '../src/Styles/drivers';
import { Tables } from '../types/database.types';
import { useAuth } from './useAuth';

// Type definitions for our database tables
type Driver = Tables<'drivers'>;
type DriverPlate = Tables<'drivers_plates'>;
type Vehicle = Tables<'vehicles'>;
type DriverDocument = Tables<'driver_documents'>;

export interface CompleteDriverProfile {
  driver: Driver;
  license: DriverPlate;
  vehicles: Vehicle[];
  documents: DriverDocument;
}

export function useDriverProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CompleteDriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GET profile
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          drivers_plates (*),
          vehicles (*),
          driver_documents (*)
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // profile check
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile({
          driver: data,
          license: data.drivers_plates,
          vehicles: Array.isArray(data.vehicles) ? data.vehicles : (data.vehicles ? [data.vehicles] : []),
          documents: data.driver_documents,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Error fetching driver profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // POST profile
  const saveDriverProfile = async (formData: DriverRegistrationForm) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const driverData = {
        id: user.id,
        first_name: formData.personalInfo.firstName,
        last_name: formData.personalInfo.lastName,
        email: formData.personalInfo.email,
        phone_number: formData.personalInfo.phoneNumber,
        user_type: 'driver' as const,
        is_active: true,
        email_verified: false,
        phone_verified: false,
      };

      const licenseData = {
        user_id: user.id,
        license_number: formData.licenseInfo.licenseNumber,
        license_expiry: formData.licenseInfo.expirationDate,
        license_state: formData.licenseInfo.state,
      };

      const vehicleData = {
        driver_id: user.id,
        make: formData.vehicleInfo.make,
        model: formData.vehicleInfo.model,
        year: formData.vehicleInfo.year,
        color: formData.vehicleInfo.color,
        license_plate: formData.vehicleInfo.licensePlate,
        vehicle_type: 'car' as const,
        seating_capacity: 4,
        is_active: true,
      };

      const documentData = {
        driver_id: user.id,
        license_status: formData.documents.license,
        insurance_status: formData.documents.insurance,
        registration_status: formData.documents.registration,
      };

      const { error: driverError } = await supabase
        .from('drivers')
        .upsert(driverData);

      if (driverError) throw driverError;

      const { error: licenseError } = await supabase
        .from('drivers_plates')
        .upsert(licenseData);

      if (licenseError) throw licenseError;

      const { error: vehicleError } = await supabase
        .from('vehicles')
        .upsert(vehicleData);

      if (vehicleError) throw vehicleError;

      const { error: documentError } = await supabase
        .from('driver_documents')
        .upsert(documentData);

      if (documentError) throw documentError;

      await fetchProfile();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      console.error('Error saving driver profile:', err);
      throw new Error(errorMessage);
    }
  };

  // PUT profile
  const updateDriverInfo = async (updates: Partial<Driver>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('drivers')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update driver info';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateLicenseInfo = async (updates: Partial<DriverPlate>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('drivers_plates')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update license info';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateVehicleInfo = async (vehicleId: string, updates: Partial<Vehicle>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', vehicleId)
        .eq('driver_id', user.id); 

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vehicle info';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // PUT document status
  const updateDocumentStatus = async (updates: Partial<DriverDocument>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('driver_documents')
        .update(updates)
        .eq('driver_id', user.id);

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // POST vehicle
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'driver_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          driver_id: user.id,
        });

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // DELETE vehicle
  const removeVehicle = async (vehicleId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)
        .eq('driver_id', user.id); 

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // profile check
  const hasProfile = profile !== null;

  // profile completion status
  const getProfileCompletion = () => {
    if (!profile) return 0;

    let completed = 0;
    const total = 4; 

    if (profile.driver) completed++;
    if (profile.license) completed++;
    if (profile.vehicles && profile.vehicles.length > 0) completed++;
    if (profile.documents) completed++;

    return (completed / total) * 100;
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    hasProfile,
    profileCompletion: getProfileCompletion(),
    
    // function calls
    saveDriverProfile,
    fetchProfile,
    
    updateDriverInfo,
    updateLicenseInfo,
    updateVehicleInfo,
    updateDocumentStatus,
    
    addVehicle,
    removeVehicle,
    
    clearError: () => setError(null),
  };
}