import { Smartphone, Mail, CreditCard } from 'lucide-react';
import { Settings, Integration } from './types';

export const defaultSettings: Settings = {
  // General
  companyName: 'ProStatus Logistics',
  timezone: 'America/Chicago',
  language: 'en',

  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  dailyDigest: true,
  weeklyReport: true,
  exceptionAlerts: true,

  // Appearance
  darkMode: true,
  compactMode: false,
  animationsEnabled: true,

  // Security
  twoFactorEnabled: false,
  sessionTimeout: '30',
  ipWhitelist: '',

  // API
  apiKey: 'sk_live_xxxxxxxxxxxxxxxxxxxxx',
  webhookUrl: 'https://api.yourcompany.com/webhooks/prostatus',
  rateLimitPerMinute: '100',
};

export const integrations: Integration[] = [
  { name: 'Super Dispatch TMS', status: 'Connected', icon: Smartphone },
  { name: 'Twilio SMS', status: 'Connected', icon: Mail },
  { name: 'SendGrid Email', status: 'Connected', icon: Mail },
  { name: 'Stripe Payments', status: 'Not Connected', icon: CreditCard },
];

export const accentColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
];
