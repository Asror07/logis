// Vehicle types from API
export type VehicleType = 'semi_truck' | 'box_truck' | 'sprinter' | 'flatbed';

// Driver status from API
export type DriverStatus = 'active' | 'inactive' | 'on_leave' | 'suspended';

// Driver DTO 
export interface CreateDriverDto {
  full_name: string;
  email: string;
  phone: string;
  home_base: string;
  vehicle: string;
  vehicle_type: VehicleType;
  license_number: string;
  license_expiry: string; // ISO date format: "YYYY-MM-DD"
  emergency_name: string;
  emergency_phone: string;
  emergency_relationship: string;
  notes?: string;
  status?: DriverStatus;
}

// Driver DTO for updating
export interface UpdateDriverDto extends Partial<CreateDriverDto> {
  id: number;
}

// Driver DTO for patching specific fields
export type PatchDriverDto = Partial<CreateDriverDto> & { id: number };

// Driver API Response for a single driver
export interface DriverResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  home_base: string;
  vehicle: string;
  vehicle_type: VehicleType;
  license_number: string;
  license_expiry: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_relationship: string;
  notes?: string;
  status: DriverStatus;
  created_at?: string;
  updated_at?: string;
}

// Paginated list response
export interface DriversListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DriverResponse[];
}

// Query params for listing drivers
export interface DriversQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: DriverStatus;
  vehicle_type?: VehicleType;
  ordering?: string;
}

// Legacy Driver interface (for backward compatibility with existing UI)
export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  vehicle: string;
  vehicleType: 'semi' | 'box-truck' | 'sprinter' | 'flatbed';
  licenseNumber: string;
  licenseExpiry: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave' | 'suspended';
  currentLocation?: { address: string };
  homeBase: string;
  stats: DriverStats;
  loadHistory: LoadHistory[];
  certifications: Certification[];
  emergencyContact: EmergencyContact;
  notes?: string;
}

export interface DriverStats {
  totalLoads: number;
  completedLoads: number;
  onTimeDeliveryRate: number;
  totalMiles: number;
  averageRating: number;
  exceptionsCount: number;
  hoursThisWeek: number;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface LoadHistory {
  id: string;
  origin: string;
  destination: string;
  date: string;
  status: 'completed' | 'exception' | 'cancelled';
  miles: number;
  rating?: number;
  feedback?: string;
}

export interface Certification {
  name: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
}