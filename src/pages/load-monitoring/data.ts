import { Trip, Driver } from './types';

export const initialTrips: Trip[] = [
  {
    id: 'TRP-8801',
    driverId: 'DRV-001',
    driverName: 'John Martinez',
    driverPhone: '+1 (555) 123-4567',
    vehicle: '2024 Peterbilt 579',
    status: 'in-transit',
    scheduleStatus: 'on-time',
    stops: [
      {
        order: 1,
        type: 'pickup',
        location: { lng: -118.2437, lat: 34.0522, address: 'Los Angeles, CA', name: 'LA Port Terminal' },
        status: 'completed',
        units: ['VIN001', 'VIN002', 'VIN003', 'VIN004', 'VIN005'],
        scheduledTime: '08:00 AM',
        actualArrival: '07:45 AM',
        actualDeparture: '09:30 AM'
      },
      {
        order: 2,
        type: 'delivery',
        location: { lng: -117.1611, lat: 32.7157, address: 'San Diego, CA', name: 'Pacific Honda' },
        status: 'completed',
        units: ['VIN001', 'VIN002'],
        scheduledTime: '12:00 PM',
        actualArrival: '11:45 AM',
        actualDeparture: '12:30 PM'
      },
      {
        order: 3,
        type: 'delivery',
        location: { lng: -112.0740, lat: 33.4484, address: 'Phoenix, AZ', name: 'Desert Toyota' },
        status: 'in-progress',
        units: ['VIN003'],
        scheduledTime: '4:00 PM'
      },
      {
        order: 4,
        type: 'delivery',
        location: { lng: -111.8910, lat: 33.4152, address: 'Tempe, AZ', name: 'Tempe Ford' },
        status: 'pending',
        units: ['VIN004', 'VIN005'],
        scheduledTime: '5:30 PM'
      }
    ],
    units: [
      { id: 'VIN001', make: 'Honda', model: 'Accord', year: 2024, color: 'White', destinationStopOrder: 2, status: 'delivered', deliveredAt: '11:50 AM', signedBy: 'Mike Chen' },
      { id: 'VIN002', make: 'Honda', model: 'Civic', year: 2024, color: 'Black', destinationStopOrder: 2, status: 'delivered', deliveredAt: '12:05 PM', signedBy: 'Mike Chen' },
      { id: 'VIN003', make: 'Toyota', model: 'Camry', year: 2024, color: 'Silver', destinationStopOrder: 3, status: 'in-transit' },
      { id: 'VIN004', make: 'Ford', model: 'F-150', year: 2024, color: 'Blue', destinationStopOrder: 4, status: 'in-transit' },
      { id: 'VIN005', make: 'Ford', model: 'Mustang', year: 2024, color: 'Red', destinationStopOrder: 4, status: 'in-transit' }
    ],
    currentStopIndex: 3,
    currentPosition: { lng: -114.5, lat: 33.8 },
    totalStops: 4,
    completedStops: 2,
    totalUnits: 5,
    deliveredUnits: 2,
    startTime: '07:00 AM',
    estimatedEndTime: '6:00 PM',
    eta: '3:45 PM',
    statusHistory: [
      { timestamp: '07:00 AM', event: 'Trip Started', description: 'Driver departed for pickup location', updatedBy: 'System' },
      { timestamp: '07:45 AM', event: 'Arrived at Pickup', description: 'Driver arrived at LA Port Terminal', stopOrder: 1 },
      { timestamp: '09:30 AM', event: 'Pickup Complete', description: '5 units loaded successfully', stopOrder: 1 },
      { timestamp: '11:45 AM', event: 'Arrived at Stop 2', description: 'Driver arrived at Pacific Honda', stopOrder: 2 },
      { timestamp: '12:30 PM', event: 'Delivery Complete', description: '2 units delivered at Pacific Honda', stopOrder: 2 }
    ]
  },
  {
    id: 'TRP-8802',
    driverId: 'DRV-002',
    driverName: 'Sarah Johnson',
    driverPhone: '+1 (555) 234-5678',
    vehicle: '2023 Freightliner Cascadia',
    status: 'in-transit',
    scheduleStatus: 'at-risk',
    stops: [
      {
        order: 1,
        type: 'pickup',
        location: { lng: -96.7970, lat: 32.7767, address: 'Dallas, TX', name: 'Dallas Auto Auction' },
        status: 'completed',
        units: ['VIN006', 'VIN007', 'VIN008'],
        scheduledTime: '06:00 AM',
        actualArrival: '06:15 AM',
        actualDeparture: '07:30 AM'
      },
      {
        order: 2,
        type: 'delivery',
        location: { lng: -95.3698, lat: 29.7604, address: 'Houston, TX', name: 'Houston Toyota' },
        status: 'completed',
        units: ['VIN006'],
        scheduledTime: '10:00 AM',
        actualArrival: '10:30 AM',
        actualDeparture: '11:00 AM'
      },
      {
        order: 3,
        type: 'delivery',
        location: { lng: -90.0715, lat: 29.9511, address: 'New Orleans, LA', name: 'NOLA Chevrolet' },
        status: 'in-progress',
        units: ['VIN007', 'VIN008'],
        scheduledTime: '3:00 PM',
        notes: 'Traffic delay on I-10'
      }
    ],
    units: [
      { id: 'VIN006', make: 'Toyota', model: 'RAV4', year: 2024, color: 'Gray', destinationStopOrder: 2, status: 'delivered', deliveredAt: '10:45 AM', signedBy: 'Tom Wilson' },
      { id: 'VIN007', make: 'Chevrolet', model: 'Silverado', year: 2024, color: 'White', destinationStopOrder: 3, status: 'in-transit' },
      { id: 'VIN008', make: 'Chevrolet', model: 'Tahoe', year: 2024, color: 'Black', destinationStopOrder: 3, status: 'in-transit' }
    ],
    currentStopIndex: 3,
    currentPosition: { lng: -92.5, lat: 30.2 },
    totalStops: 3,
    completedStops: 2,
    totalUnits: 3,
    deliveredUnits: 1,
    startTime: '05:30 AM',
    estimatedEndTime: '4:00 PM',
    eta: '3:45 PM',
    statusHistory: [
      { timestamp: '05:30 AM', event: 'Trip Started', description: 'Driver departed for pickup', updatedBy: 'System' },
      { timestamp: '06:15 AM', event: 'Arrived at Pickup', description: 'Driver arrived at Dallas Auto Auction', stopOrder: 1 },
      { timestamp: '07:30 AM', event: 'Pickup Complete', description: '3 units loaded', stopOrder: 1 },
      { timestamp: '10:30 AM', event: 'Arrived at Stop 2', description: 'Driver arrived at Houston Toyota', stopOrder: 2 },
      { timestamp: '11:00 AM', event: 'Delivery Complete', description: '1 unit delivered', stopOrder: 2 },
      { timestamp: '01:30 PM', event: 'Delay Reported', description: 'Traffic congestion on I-10', updatedBy: 'Sarah Johnson' }
    ]
  },
  {
    id: 'TRP-8803',
    driverId: 'DRV-003',
    driverName: 'Mike Thompson',
    driverPhone: '+1 (555) 345-6789',
    vehicle: '2024 Kenworth T680',
    status: 'in-transit',
    scheduleStatus: 'late',
    stops: [
      {
        order: 1,
        type: 'pickup',
        location: { lng: -122.4194, lat: 37.7749, address: 'San Francisco, CA', name: 'SF Import Terminal' },
        status: 'completed',
        units: ['VIN009', 'VIN010', 'VIN011', 'VIN012'],
        scheduledTime: '05:00 AM',
        actualArrival: '05:30 AM',
        actualDeparture: '07:00 AM'
      },
      {
        order: 2,
        type: 'delivery',
        location: { lng: -121.4944, lat: 38.5816, address: 'Sacramento, CA', name: 'Capitol Nissan' },
        status: 'completed',
        units: ['VIN009'],
        scheduledTime: '09:00 AM',
        actualArrival: '09:30 AM',
        actualDeparture: '10:00 AM'
      },
      {
        order: 3,
        type: 'delivery',
        location: { lng: -119.7871, lat: 36.7378, address: 'Fresno, CA', name: 'Central Valley BMW' },
        status: 'completed',
        units: ['VIN010'],
        scheduledTime: '12:00 PM',
        actualArrival: '01:00 PM',
        actualDeparture: '01:30 PM'
      },
      {
        order: 4,
        type: 'delivery',
        location: { lng: -118.2437, lat: 34.0522, address: 'Los Angeles, CA', name: 'Beverly Hills Mercedes' },
        status: 'in-progress',
        units: ['VIN011', 'VIN012'],
        scheduledTime: '4:00 PM',
        notes: 'Running 2 hours behind schedule'
      }
    ],
    units: [
      { id: 'VIN009', make: 'Nissan', model: 'Altima', year: 2024, color: 'Blue', destinationStopOrder: 2, status: 'delivered', deliveredAt: '09:45 AM', signedBy: 'James Lee' },
      { id: 'VIN010', make: 'BMW', model: 'X5', year: 2024, color: 'White', destinationStopOrder: 3, status: 'delivered', deliveredAt: '01:15 PM', signedBy: 'Anna Kim' },
      { id: 'VIN011', make: 'Mercedes', model: 'GLE', year: 2024, color: 'Black', destinationStopOrder: 4, status: 'in-transit' },
      { id: 'VIN012', make: 'Mercedes', model: 'S-Class', year: 2024, color: 'Silver', destinationStopOrder: 4, status: 'in-transit' }
    ],
    currentStopIndex: 4,
    currentPosition: { lng: -118.5, lat: 34.2 },
    totalStops: 4,
    completedStops: 3,
    totalUnits: 4,
    deliveredUnits: 2,
    startTime: '04:30 AM',
    estimatedEndTime: '5:00 PM',
    eta: '6:00 PM',
    statusHistory: [
      { timestamp: '04:30 AM', event: 'Trip Started', description: 'Driver departed', updatedBy: 'System' },
      { timestamp: '05:30 AM', event: 'Arrived at Pickup', description: 'Arrived at SF Import Terminal', stopOrder: 1 },
      { timestamp: '07:00 AM', event: 'Pickup Complete', description: '4 units loaded', stopOrder: 1 },
      { timestamp: '09:30 AM', event: 'Stop 2 Arrived', description: 'Arrived at Capitol Nissan', stopOrder: 2 },
      { timestamp: '10:00 AM', event: 'Stop 2 Complete', description: '1 unit delivered', stopOrder: 2 },
      { timestamp: '01:00 PM', event: 'Stop 3 Arrived', description: 'Arrived at Central Valley BMW', stopOrder: 3 },
      { timestamp: '01:30 PM', event: 'Stop 3 Complete', description: '1 unit delivered', stopOrder: 3 }
    ]
  },
  {
    id: 'TRP-8804',
    driverId: 'DRV-004',
    driverName: 'Emily Davis',
    driverPhone: '+1 (555) 456-7890',
    vehicle: '2024 Volvo VNL 860',
    status: 'in-transit',
    scheduleStatus: 'on-time',
    stops: [
      {
        order: 1,
        type: 'pickup',
        location: { lng: -80.1918, lat: 25.7617, address: 'Miami, FL', name: 'Port of Miami' },
        status: 'completed',
        units: ['VIN013', 'VIN014', 'VIN015', 'VIN016', 'VIN017', 'VIN018'],
        scheduledTime: '06:00 AM',
        actualArrival: '05:45 AM',
        actualDeparture: '08:00 AM'
      },
      {
        order: 2,
        type: 'delivery',
        location: { lng: -81.3792, lat: 28.5383, address: 'Orlando, FL', name: 'Orlando Volkswagen' },
        status: 'in-progress',
        units: ['VIN013', 'VIN014'],
        scheduledTime: '11:00 AM'
      },
      {
        order: 3,
        type: 'delivery',
        location: { lng: -81.6557, lat: 30.3322, address: 'Jacksonville, FL', name: 'Jax Audi' },
        status: 'pending',
        units: ['VIN015', 'VIN016'],
        scheduledTime: '2:00 PM'
      },
      {
        order: 4,
        type: 'delivery',
        location: { lng: -84.3880, lat: 33.7490, address: 'Atlanta, GA', name: 'Atlanta Porsche' },
        status: 'pending',
        units: ['VIN017', 'VIN018'],
        scheduledTime: '6:00 PM'
      }
    ],
    units: [
      { id: 'VIN013', make: 'Volkswagen', model: 'ID.4', year: 2024, color: 'Blue', destinationStopOrder: 2, status: 'in-transit' },
      { id: 'VIN014', make: 'Volkswagen', model: 'Atlas', year: 2024, color: 'Gray', destinationStopOrder: 2, status: 'in-transit' },
      { id: 'VIN015', make: 'Audi', model: 'Q7', year: 2024, color: 'Black', destinationStopOrder: 3, status: 'in-transit' },
      { id: 'VIN016', make: 'Audi', model: 'A6', year: 2024, color: 'White', destinationStopOrder: 3, status: 'in-transit' },
      { id: 'VIN017', make: 'Porsche', model: 'Cayenne', year: 2024, color: 'Red', destinationStopOrder: 4, status: 'in-transit' },
      { id: 'VIN018', make: 'Porsche', model: '911', year: 2024, color: 'Yellow', destinationStopOrder: 4, status: 'in-transit' }
    ],
    currentStopIndex: 2,
    currentPosition: { lng: -80.8, lat: 27.5 },
    totalStops: 4,
    completedStops: 1,
    totalUnits: 6,
    deliveredUnits: 0,
    startTime: '05:00 AM',
    estimatedEndTime: '7:00 PM',
    eta: '10:45 AM',
    statusHistory: [
      { timestamp: '05:00 AM', event: 'Trip Started', description: 'Driver departed', updatedBy: 'System' },
      { timestamp: '05:45 AM', event: 'Arrived at Pickup', description: 'Arrived at Port of Miami', stopOrder: 1 },
      { timestamp: '08:00 AM', event: 'Pickup Complete', description: '6 units loaded', stopOrder: 1 }
    ]
  },
  {
    id: 'TRP-8805',
    driverId: 'DRV-005',
    driverName: 'Robert Wilson',
    driverPhone: '+1 (555) 567-8901',
    vehicle: '2023 Mack Anthem',
    status: 'completed',
    scheduleStatus: 'on-time',
    stops: [
      {
        order: 1,
        type: 'pickup',
        location: { lng: -74.0060, lat: 40.7128, address: 'New York, NY', name: 'Port Newark' },
        status: 'completed',
        units: ['VIN019', 'VIN020'],
        scheduledTime: '07:00 AM',
        actualArrival: '06:45 AM',
        actualDeparture: '08:00 AM'
      },
      {
        order: 2,
        type: 'delivery',
        location: { lng: -71.0589, lat: 42.3601, address: 'Boston, MA', name: 'Boston Lexus' },
        status: 'completed',
        units: ['VIN019', 'VIN020'],
        scheduledTime: '12:00 PM',
        actualArrival: '11:30 AM',
        actualDeparture: '12:15 PM'
      }
    ],
    units: [
      { id: 'VIN019', make: 'Lexus', model: 'RX', year: 2024, color: 'Pearl White', destinationStopOrder: 2, status: 'delivered', deliveredAt: '11:45 AM', signedBy: 'David Park' },
      { id: 'VIN020', make: 'Lexus', model: 'ES', year: 2024, color: 'Obsidian', destinationStopOrder: 2, status: 'delivered', deliveredAt: '12:00 PM', signedBy: 'David Park' }
    ],
    currentStopIndex: 2,
    currentPosition: { lng: -71.0589, lat: 42.3601 },
    totalStops: 2,
    completedStops: 2,
    totalUnits: 2,
    deliveredUnits: 2,
    startTime: '06:00 AM',
    estimatedEndTime: '1:00 PM',
    eta: 'Completed',
    statusHistory: [
      { timestamp: '06:00 AM', event: 'Trip Started', description: 'Driver departed', updatedBy: 'System' },
      { timestamp: '06:45 AM', event: 'Arrived at Pickup', description: 'Arrived at Port Newark', stopOrder: 1 },
      { timestamp: '08:00 AM', event: 'Pickup Complete', description: '2 units loaded', stopOrder: 1 },
      { timestamp: '11:30 AM', event: 'Arrived at Stop 2', description: 'Arrived at Boston Lexus', stopOrder: 2 },
      { timestamp: '12:15 PM', event: 'Trip Completed', description: 'All units delivered successfully', stopOrder: 2 }
    ]
  },
  {
    id: 'TRP-8806',
    driverId: 'DRV-006',
    driverName: 'Lisa Anderson',
    driverPhone: '+1 (555) 678-9012',
    vehicle: '2024 International LT',
    status: 'scheduled',
    scheduleStatus: 'on-time',
    stops: [
      {
        order: 1,
        type: 'pickup',
        location: { lng: -104.9903, lat: 39.7392, address: 'Denver, CO', name: 'Denver Auto Hub' },
        status: 'pending',
        units: ['VIN021', 'VIN022', 'VIN023'],
        scheduledTime: '2:00 PM'
      },
      {
        order: 2,
        type: 'delivery',
        location: { lng: -111.8910, lat: 40.7608, address: 'Salt Lake City, UT', name: 'SLC Subaru' },
        status: 'pending',
        units: ['VIN021'],
        scheduledTime: '7:00 PM'
      },
      {
        order: 3,
        type: 'delivery',
        location: { lng: -116.2023, lat: 43.6150, address: 'Boise, ID', name: 'Boise Hyundai' },
        status: 'pending',
        units: ['VIN022', 'VIN023'],
        scheduledTime: '10:00 PM'
      }
    ],
    units: [
      { id: 'VIN021', make: 'Subaru', model: 'Outback', year: 2024, color: 'Green', destinationStopOrder: 2, status: 'loaded' },
      { id: 'VIN022', make: 'Hyundai', model: 'Tucson', year: 2024, color: 'Silver', destinationStopOrder: 3, status: 'loaded' },
      { id: 'VIN023', make: 'Hyundai', model: 'Santa Fe', year: 2024, color: 'Blue', destinationStopOrder: 3, status: 'loaded' }
    ],
    currentStopIndex: 1,
    currentPosition: { lng: -104.9903, lat: 39.7392 },
    totalStops: 3,
    completedStops: 0,
    totalUnits: 3,
    deliveredUnits: 0,
    startTime: '1:00 PM',
    estimatedEndTime: '11:00 PM',
    eta: '2:00 PM',
    statusHistory: [
      { timestamp: '10:00 AM', event: 'Trip Created', description: 'Trip scheduled and assigned to driver', updatedBy: 'Dispatcher Mike' }
    ]
  }
];

// Legacy driver data for backward compatibility
export const initialDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Martinez',
    vehicle: '2023 Freightliner Cascadia',
    phone: '+1 (555) 123-4567',
    pickupLocation: { lng: -118.2437, lat: 34.0522, address: 'Los Angeles, CA' },
    deliveryLocation: { lng: -112.0740, lat: 33.4484, address: 'Phoenix, AZ' },
    currentPosition: { lng: -115.1398, lat: 36.1699 },
    progress: 65,
    scheduleStatus: 'on-time',
    loadStatus: 'in-transit',
    statusHistory: [
      { status: 'order-created', timestamp: '2024-01-15 08:00', updatedBy: 'System' },
      { status: 'assigned-to-carrier', timestamp: '2024-01-15 08:30', updatedBy: 'Dispatcher Mike' },
      { status: 'dispatched', timestamp: '2024-01-15 09:00', updatedBy: 'Dispatcher Mike' },
      { status: 'at-pickup', timestamp: '2024-01-15 10:30', updatedBy: 'John Martinez' },
      { status: 'inspection-in-progress', timestamp: '2024-01-15 10:45', updatedBy: 'John Martinez' },
      { status: 'picked-up', timestamp: '2024-01-15 11:15', updatedBy: 'John Martinez', notes: 'Vehicle loaded successfully' },
      { status: 'in-transit', timestamp: '2024-01-15 11:30', updatedBy: 'John Martinez' }
    ],
    eta: '2:30 PM',
    scheduledTime: '3:00 PM'
  }
];
