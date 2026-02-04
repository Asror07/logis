// ==================== ASSET STATUS ====================
export type AssetStatus = 'active' | 'maintenance' | 'out-of-service';

export const assetStatusConfig: Record<AssetStatus, { label: string; color: string; bg: string }> = {
  'active': { label: 'Active', color: 'text-green-400', bg: 'bg-green-500' },
  'maintenance': { label: 'Maintenance', color: 'text-orange-400', bg: 'bg-orange-500' },
  'out-of-service': { label: 'Out of Service', color: 'text-destructive', bg: 'bg-destructive' }
};

// ==================== TRAILER TYPE ====================
export type TrailerType = 'reefer' | 'dry-van' | 'flatbed' | 'car-hauler' | 'lowboy';

export const trailerTypeConfig: Record<TrailerType, { label: string }> = {
  'reefer': { label: 'Reefer' },
  'dry-van': { label: 'Dry Van' },
  'flatbed': { label: 'Flatbed' },
  'car-hauler': { label: 'Car Hauler' },
  'lowboy': { label: 'Lowboy' }
};

// ==================== TRUCK INTERFACE ====================
export interface Truck {
  id: string;
  unitNumber: string;
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  status: AssetStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  currentLocation?: string;
  mileage?: number;
  lastServiceDate?: string;
  nextServiceDue?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== TRAILER INTERFACE ====================
export interface Trailer {
  id: string;
  trailerNumber: string;
  type: TrailerType;
  status: AssetStatus;
  capacity: number;
  currentLocation?: string;
  lastInspectionDate?: string;
  nextInspectionDue?: string;
  licensePlate?: string;
  vin?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== FORM TYPES ====================
export type TruckFormData = Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>;
export type TrailerFormData = Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'>;
