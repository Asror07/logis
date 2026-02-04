import { Package, User, Truck, MapPin, FileCheck, Navigation, AlertTriangle, Warehouse, CheckCircle2, CreditCard } from 'lucide-react';

// ==================== UNIT STATUS ====================
export type UnitStatus = 'loaded' | 'in-transit' | 'delivered';

export const unitStatusConfig: Record<UnitStatus, { label: string; color: string }> = {
  'loaded': { label: 'Loaded', color: 'text-blue-400' },
  'in-transit': { label: 'In Transit', color: 'text-yellow-400' },
  'delivered': { label: 'Delivered', color: 'text-green-400' }
};

// ==================== STOP STATUS ====================
export type StopStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

export const stopStatusConfig: Record<StopStatus, { label: string; color: string; bg: string }> = {
  'pending': { label: 'Pending', color: 'text-muted-foreground', bg: 'bg-muted' },
  'in-progress': { label: 'In Progress', color: 'text-orange-400', bg: 'bg-orange-500' },
  'completed': { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500' },
  'skipped': { label: 'Skipped', color: 'text-destructive', bg: 'bg-destructive' }
};

// ==================== TRIP STATUS ====================
export type TripStatus = 'scheduled' | 'in-transit' | 'completed' | 'cancelled';

export const tripStatusConfig: Record<TripStatus, { label: string; color: string; bg: string }> = {
  'scheduled': { label: 'Scheduled', color: 'text-slate-400', bg: 'bg-slate-500' },
  'in-transit': { label: 'In Transit', color: 'text-yellow-400', bg: 'bg-yellow-500' },
  'completed': { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500' },
  'cancelled': { label: 'Cancelled', color: 'text-destructive', bg: 'bg-destructive' }
};

// ==================== UNIT INTERFACE ====================
export interface Unit {
  id: string;              // VIN number
  make: string;
  model: string;
  year: number;
  color: string;
  destinationStopOrder: number;
  status: UnitStatus;
  deliveredAt?: string;
  signedBy?: string;
}

// ==================== TRIP STOP INTERFACE ====================
export interface TripStop {
  order: number;
  type: 'pickup' | 'delivery';
  location: {
    lng: number;
    lat: number;
    address: string;
    name: string;
  };
  status: StopStatus;
  units: string[];          // VIN IDs
  scheduledTime: string;
  actualArrival?: string;
  actualDeparture?: string;
  notes?: string;
}

// ==================== TRIP STATUS HISTORY ====================
export interface TripStatusHistoryItem {
  timestamp: string;
  event: string;
  description: string;
  updatedBy?: string;
  stopOrder?: number;
}

// ==================== TRIP INTERFACE ====================
export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicle: string;
  
  // Trip status
  status: TripStatus;
  scheduleStatus: 'on-time' | 'at-risk' | 'late';
  
  // Route information
  stops: TripStop[];
  currentStopIndex: number;
  currentPosition: { lng: number; lat: number };
  
  // Units on this trip
  units: Unit[];
  
  // Progress tracking
  totalStops: number;
  completedStops: number;
  totalUnits: number;
  deliveredUnits: number;
  
  // Timing
  startTime: string;
  estimatedEndTime: string;
  eta: string;
  
  // History
  statusHistory: TripStatusHistoryItem[];
}

// ==================== SCHEDULE STATUS ====================
export const scheduleStatusLabels = {
  'on-time': 'On Time',
  'at-risk': 'At Risk',
  'late': 'Late'
};

export const statusColors = {
  'on-time': { bg: 'bg-success', text: 'text-success', hex: '#22c55e' },
  'at-risk': { bg: 'bg-warning', text: 'text-warning', hex: '#f59e0b' },
  'late': { bg: 'bg-destructive', text: 'text-destructive', hex: '#ef4444' }
};

// ==================== TRIP STATUS COLORS ====================
export const tripPhaseColors = {
  'scheduled': { bg: 'bg-slate-500', text: 'text-slate-400', hex: '#64748b' },
  'in-transit': { bg: 'bg-yellow-500', text: 'text-yellow-400', hex: '#eab308' },
  'completed': { bg: 'bg-green-500', text: 'text-green-400', hex: '#22c55e' },
  'cancelled': { bg: 'bg-destructive', text: 'text-destructive', hex: '#ef4444' }
};

// ==================== HELPER FUNCTIONS ====================
export const calculateTripProgress = (trip: Trip): number => {
  if (trip.totalStops === 0) return 0;
  return Math.round((trip.completedStops / trip.totalStops) * 100);
};

export const getUnitsForStop = (trip: Trip, stopOrder: number): Unit[] => {
  const stop = trip.stops.find(s => s.order === stopOrder);
  if (!stop) return [];
  return trip.units.filter(u => stop.units.includes(u.id));
};

export const getCurrentStop = (trip: Trip): TripStop | undefined => {
  return trip.stops.find(s => s.status === 'in-progress') || 
         trip.stops.find(s => s.status === 'pending');
};

export const getNextStop = (trip: Trip): TripStop | undefined => {
  const currentIndex = trip.stops.findIndex(s => s.status === 'in-progress');
  if (currentIndex === -1) {
    return trip.stops.find(s => s.status === 'pending');
  }
  return trip.stops[currentIndex + 1];
};

// ==================== LEGACY TYPES (for backward compatibility) ====================
export type LoadStatus =
  | 'order-created'
  | 'assigned-to-carrier'
  | 'dispatched'
  | 'at-pickup'
  | 'inspection-in-progress'
  | 'picked-up'
  | 'in-transit'
  | 'on-delay'
  | 'at-storage'
  | 'near-delivery'
  | 'at-delivery'
  | 'unloaded'
  | 'delivery-inspection'
  | 'delivered'
  | 'invoiced'
  | 'paid';

export interface LoadStatusConfig {
  label: string;
  description: string;
  phase: 'Pre-Dispatch' | 'Pickup' | 'In Transit' | 'Delivery' | 'Post-Delivery';
  phaseOrder: number;
  stepOrder: number;
  icon: typeof Package;
  color: string;
}

export interface StatusHistoryItem {
  status: LoadStatus;
  timestamp: string;
  updatedBy?: string;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  phone: string;
  pickupLocation: { lng: number; lat: number; address: string };
  deliveryLocation: { lng: number; lat: number; address: string };
  currentPosition: { lng: number; lat: number };
  progress: number;
  scheduleStatus: 'on-time' | 'at-risk' | 'late';
  loadStatus: LoadStatus;
  statusHistory: StatusHistoryItem[];
  eta: string;
  scheduledTime: string;
}

export interface PhaseColors {
  bg: string;
  text: string;
  hex: string;
}

export const loadStatusConfig: Record<LoadStatus, LoadStatusConfig> = {
  'order-created': {
    label: 'Order Created',
    description: 'Buyurtma tizimga kiritildi va tashuvchi qidirilmoqda',
    phase: 'Pre-Dispatch',
    phaseOrder: 1,
    stepOrder: 1,
    icon: Package,
    color: 'text-slate-400'
  },
  'assigned-to-carrier': {
    label: 'Assigned to Carrier',
    description: 'Yuk haydovchi yoki transport kompaniyasiga biriktirildi',
    phase: 'Pre-Dispatch',
    phaseOrder: 1,
    stepOrder: 2,
    icon: User,
    color: 'text-slate-400'
  },
  'dispatched': {
    label: 'Dispatched',
    description: 'Haydovchi yukni olish uchun yo\'lga chiqdi',
    phase: 'Pre-Dispatch',
    phaseOrder: 1,
    stepOrder: 3,
    icon: Truck,
    color: 'text-slate-400'
  },
  'at-pickup': {
    label: 'At Pickup Location',
    description: 'Haydovchi yukni olish joyiga yetib bordi',
    phase: 'Pickup',
    phaseOrder: 2,
    stepOrder: 1,
    icon: MapPin,
    color: 'text-blue-400'
  },
  'inspection-in-progress': {
    label: 'Inspection in Progress',
    description: 'Haydovchi mashinani tekshiruvdan o\'tkazmoqda',
    phase: 'Pickup',
    phaseOrder: 2,
    stepOrder: 2,
    icon: FileCheck,
    color: 'text-blue-400'
  },
  'picked-up': {
    label: 'Picked Up / Loaded',
    description: 'Mashina traylerga yuklandi va yo\'lga chiqdi',
    phase: 'Pickup',
    phaseOrder: 2,
    stepOrder: 3,
    icon: Package,
    color: 'text-blue-400'
  },
  'in-transit': {
    label: 'In Transit',
    description: 'Yuk mashinasi belgilangan manzilga qarab harakatlanmoqda',
    phase: 'In Transit',
    phaseOrder: 3,
    stepOrder: 1,
    icon: Navigation,
    color: 'text-yellow-400'
  },
  'on-delay': {
    label: 'On Delay',
    description: 'Yo\'lda kutilmagan holat tufayli kechikish bo\'ldi',
    phase: 'In Transit',
    phaseOrder: 3,
    stepOrder: 2,
    icon: AlertTriangle,
    color: 'text-yellow-400'
  },
  'at-storage': {
    label: 'At Storage',
    description: 'Mashina terminalda yoki vaqtinchalik omborda qoldirildi',
    phase: 'In Transit',
    phaseOrder: 3,
    stepOrder: 3,
    icon: Warehouse,
    color: 'text-yellow-400'
  },
  'near-delivery': {
    label: 'Near Delivery Location',
    description: 'Haydovchi manzilga yaqin qoldi (10-20 mil)',
    phase: 'Delivery',
    phaseOrder: 4,
    stepOrder: 1,
    icon: MapPin,
    color: 'text-orange-400'
  },
  'at-delivery': {
    label: 'At Delivery',
    description: 'Haydovchi mashinani tushirish joyiga yetib keldi',
    phase: 'Delivery',
    phaseOrder: 4,
    stepOrder: 2,
    icon: MapPin,
    color: 'text-orange-400'
  },
  'unloaded': {
    label: 'Unloaded',
    description: 'Mashina traylerdan tushirildi',
    phase: 'Delivery',
    phaseOrder: 4,
    stepOrder: 3,
    icon: Package,
    color: 'text-orange-400'
  },
  'delivery-inspection': {
    label: 'Delivery Inspection',
    description: 'Qabul qiluvchi mashinani qayta ko\'rikdan o\'tkazmoqda',
    phase: 'Delivery',
    phaseOrder: 4,
    stepOrder: 4,
    icon: FileCheck,
    color: 'text-orange-400'
  },
  'delivered': {
    label: 'Delivered / Signed',
    description: 'Qabul qiluvchi eBOLga imzo qo\'ydi. Jarayon muvaffaqiyatli yakunlandi',
    phase: 'Post-Delivery',
    phaseOrder: 5,
    stepOrder: 1,
    icon: CheckCircle2,
    color: 'text-green-400'
  },
  'invoiced': {
    label: 'Invoiced',
    description: 'Tashuvchi bajargan ishi uchun hisob-faktura yubordi',
    phase: 'Post-Delivery',
    phaseOrder: 5,
    stepOrder: 2,
    icon: FileCheck,
    color: 'text-green-400'
  },
  'paid': {
    label: 'Paid',
    description: 'Yuk uchun to\'lov amalga oshirildi',
    phase: 'Post-Delivery',
    phaseOrder: 5,
    stepOrder: 3,
    icon: CreditCard,
    color: 'text-green-400'
  }
};

export const phaseColors: Record<string, PhaseColors> = {
  'Pre-Dispatch': { bg: 'bg-slate-500', text: 'text-slate-400', hex: '#64748b' },
  'Pickup': { bg: 'bg-blue-500', text: 'text-blue-400', hex: '#3b82f6' },
  'In Transit': { bg: 'bg-yellow-500', text: 'text-yellow-400', hex: '#eab308' },
  'Delivery': { bg: 'bg-orange-500', text: 'text-orange-400', hex: '#f97316' },
  'Post-Delivery': { bg: 'bg-green-500', text: 'text-green-400', hex: '#22c55e' }
};

export const allStatusesOrdered: LoadStatus[] = [
  'order-created', 'assigned-to-carrier', 'dispatched',
  'at-pickup', 'inspection-in-progress', 'picked-up',
  'in-transit', 'on-delay', 'at-storage',
  'near-delivery', 'at-delivery', 'unloaded', 'delivery-inspection',
  'delivered', 'invoiced', 'paid'
];

export const getStatusIndex = (status: LoadStatus): number => {
  return allStatusesOrdered.indexOf(status);
};
