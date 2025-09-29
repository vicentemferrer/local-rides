-- Local Rides Database Schema
-- This file contains the complete database schema for the Local Rides app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drivers table - Stores driver personal information
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL UNIQUE,
    user_type TEXT NOT NULL DEFAULT 'driver' CHECK (user_type IN ('rider', 'driver')),
    password_hash TEXT, -- Optional for registration/login
    profile_picture TEXT, -- Optional URL
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Drivers Plates table - Stores driver-specific license info (1:1 with drivers)
CREATE TABLE drivers_plates (
    user_id UUID PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
    license_number TEXT NOT NULL,
    license_expiry DATE NOT NULL,
    license_state TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vehicles table - Stores vehicles linked to drivers (1:N)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT NOT NULL,
    color TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE,
    vehicle_type TEXT DEFAULT 'car' CHECK (vehicle_type IN ('car', 'van', 'suv', 'truck')),
    seating_capacity INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Driver Documents table - Tracks uploaded documents for drivers (1:1 with drivers)
CREATE TABLE driver_documents (
    driver_id UUID PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
    license_status TEXT NOT NULL DEFAULT 'missing' CHECK (license_status IN ('uploaded', 'pending', 'missing')),
    insurance_status TEXT NOT NULL DEFAULT 'missing' CHECK (insurance_status IN ('uploaded', 'pending', 'missing')),
    registration_status TEXT NOT NULL DEFAULT 'missing' CHECK (registration_status IN ('uploaded', 'pending', 'missing')),
    license_url TEXT,
    insurance_url TEXT,
    registration_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_drivers_phone ON drivers(phone_number);
CREATE INDEX idx_drivers_user_type ON drivers(user_type);
CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_vehicle_type ON vehicles(vehicle_type);

-- Enable Row Level Security (RLS)
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers_plates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drivers table
CREATE POLICY "drivers_own_data" ON drivers
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "drivers_can_read_others_for_rides" ON drivers
    FOR SELECT USING (true); -- Allow reading driver info for ride matching

-- RLS Policies for drivers_plates table
CREATE POLICY "drivers_own_license" ON drivers_plates
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for vehicles table
CREATE POLICY "drivers_own_vehicles" ON vehicles
    FOR ALL USING (auth.uid() = driver_id);

CREATE POLICY "vehicles_public_read" ON vehicles
    FOR SELECT USING (true); -- Allow reading vehicle info for ride matching

-- RLS Policies for driver_documents table
CREATE POLICY "drivers_own_documents" ON driver_documents
    FOR ALL USING (auth.uid() = driver_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_plates_updated_at BEFORE UPDATE ON drivers_plates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_documents_updated_at BEFORE UPDATE ON driver_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
