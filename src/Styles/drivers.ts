// Personal Information
export type UserType = 'rider' | 'driver';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  password?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function normalizeUser(input: any): User {
  return {
    id: input?.id ?? "",
    firstName: input?.firstName ?? input?.first_name,
    lastName: input?.lastName ?? input?.last_name,
    email: input?.email,
    phoneNumber: input?.phoneNumber ?? input?.phone_number,
    userType: input?.userType ?? input?.user_type,
    password: input?.password,
    profilePicture: input?.profilePicture ?? input?.profile_picture,
    createdAt: input?.createdAt ?? input?.created_at,
    updatedAt: input?.updatedAt ?? input?.updated_at,
  };
}

// License Information
export interface LicenseInfo {
  licenseNumber: string;
  expirationDate: string;
  state: string;
}

// Vehicle Information
export interface VehicleInfo {
  make: string;
  model: string;
  year: string; 
  color: string;
  licensePlate: string;
}

// Document Upload Status
export interface Documents {
  license: 'uploaded' | 'pending' | 'missing';
  insurance: 'uploaded' | 'pending' | 'missing';
  registration: 'uploaded' | 'pending' | 'missing';
}

// Full Driver Registration Form
export interface DriverRegistrationForm {
  personalInfo: User;
  licenseInfo: LicenseInfo;
  vehicleInfo: VehicleInfo;
  documents: Documents;
}
