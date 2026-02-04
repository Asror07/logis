import { UserPreference, UserRole } from './types';

export const mockUsers: UserPreference[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@abclogistics.com',
    company: 'ABC Logistics',
    role: 'shipper',
    channels: { sms: true, email: true, push: false },
    frequency: 'important',
    quietHours: { start: '22:00', end: '07:00' },
    aiLearned: { optimalChannel: 'SMS', optimalTime: '9:00 AM', confidence: 0.92 }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@xyzcarriers.com',
    company: 'XYZ Carriers',
    role: 'carrier',
    channels: { sms: true, email: true, push: true },
    frequency: 'all',
    quietHours: null,
    aiLearned: { optimalChannel: 'Email', optimalTime: '2:00 PM', confidence: 0.85 }
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@swifttransport.com',
    company: 'Swift Transport',
    role: 'driver',
    channels: { sms: true, email: false, push: true },
    frequency: 'critical',
    quietHours: { start: '20:00', end: '06:00' },
    aiLearned: { optimalChannel: 'Push', optimalTime: '11:00 AM', confidence: 0.78 }
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@autobrokers.com',
    company: 'Auto Brokers Inc',
    role: 'broker',
    channels: { sms: true, email: true, push: true },
    frequency: 'all',
    quietHours: null,
    aiLearned: { optimalChannel: 'SMS', optimalTime: '10:30 AM', confidence: 0.95 }
  },
];

export const roleColors: Record<UserRole, string> = {
  shipper: 'bg-primary/20 text-primary',
  broker: 'bg-accent/20 text-accent',
  carrier: 'bg-info/20 text-info',
  driver: 'bg-warning/20 text-warning',
};

export const roleFilterOptions = ['all', 'shipper', 'broker', 'carrier', 'driver'] as const;