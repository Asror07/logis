import { MessageSquare, Mail, Bell } from 'lucide-react';
import { Template, TemplateType, TemplateChannel } from './types';

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Pickup Confirmation',
    type: 'pickup',
    channel: 'sms',
    content: 'Great news! Your {{vehicle}} has been picked up from {{origin}}. Estimated arrival at {{destination}}: {{eta}}. Track: {{tracking_link}}',
    variables: ['vehicle', 'origin', 'destination', 'eta', 'tracking_link'],
    usageCount: 4523,
    lastUsed: '2 hours ago',
    isSystem: true
  },
  {
    id: '2',
    name: 'In Transit Update',
    type: 'transit',
    channel: 'email',
    content: 'Your vehicle is making great progress! Currently near {{location}}, {{progress}}% complete. ETA: {{eta}}',
    variables: ['location', 'progress', 'eta'],
    usageCount: 8934,
    lastUsed: '15 min ago',
    isSystem: true
  },
  {
    id: '3',
    name: 'Delivery Approaching',
    type: 'delivery',
    channel: 'push',
    content: '🚗 Your {{vehicle}} will arrive in approximately {{time_remaining}}. Please be ready!',
    variables: ['vehicle', 'time_remaining'],
    usageCount: 3421,
    lastUsed: '45 min ago',
    isSystem: true
  },
  {
    id: '4',
    name: 'Weather Delay Alert',
    type: 'exception',
    channel: 'sms',
    content: 'ALERT: Weather conditions affecting delivery of {{load_id}}. New ETA: {{new_eta}}. We apologize for any inconvenience.',
    variables: ['load_id', 'new_eta'],
    usageCount: 234,
    lastUsed: '3 days ago',
    isSystem: false
  },
  {
    id: '5',
    name: 'Payment Received',
    type: 'payment',
    channel: 'email',
    content: 'Thank you! Payment of {{amount}} for Load #{{load_id}} has been received and processed.',
    variables: ['amount', 'load_id'],
    usageCount: 1876,
    lastUsed: '1 hour ago',
    isSystem: true
  },
];

export const typeColors: Record<TemplateType, string> = {
  pickup: 'bg-info/20 text-info',
  transit: 'bg-primary/20 text-primary',
  delivery: 'bg-success/20 text-success',
  exception: 'bg-destructive/20 text-destructive',
  payment: 'bg-warning/20 text-warning',
};

export const channelIcons: Record<TemplateChannel, typeof MessageSquare> = {
  sms: MessageSquare,
  email: Mail,
  push: Bell,
};

export const typeFilterOptions = ['all', 'pickup', 'transit', 'delivery', 'exception', 'payment'] as const;

export const previewReplacements: Record<string, string> = {
  '{{vehicle}}': '2023 Honda Accord',
  '{{origin}}': 'Dallas, TX',
  '{{destination}}': 'Phoenix, AZ',
  '{{eta}}': 'Tomorrow at 2:30 PM',
  '{{tracking_link}}': 'https://track.sd/45821',
  '{{location}}': 'Abilene, TX',
  '{{progress}}': '65',
  '{{time_remaining}}': '30 minutes',
  '{{load_id}}': 'SD-45821',
  '{{new_eta}}': 'Tomorrow at 6:00 PM',
  '{{amount}}': '$1,250.00',
};