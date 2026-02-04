export type UserRole = 'shipper' | 'broker' | 'carrier' | 'driver';
export type NotificationFrequency = 'all' | 'important' | 'critical';

export interface UserPreference {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  channels: { sms: boolean; email: boolean; push: boolean };
  frequency: NotificationFrequency;
  quietHours: { start: string; end: string } | null;
  aiLearned: {
    optimalChannel: string;
    optimalTime: string;
    confidence: number;
  };
}