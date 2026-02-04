import { LucideIcon } from 'lucide-react';

export interface Settings {
  // General
  companyName: string;
  timezone: string;
  language: string;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  exceptionAlerts: boolean;

  // Appearance
  darkMode: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;

  // Security
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  ipWhitelist: string;

  // API
  apiKey: string;
  webhookUrl: string;
  rateLimitPerMinute: string;
}

export interface Integration {
  name: string;
  status: 'Connected' | 'Not Connected';
  icon: LucideIcon;
}

export interface SettingsTabProps {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: Settings[keyof Settings]) => void;
}
