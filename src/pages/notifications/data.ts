import { Notification } from './types';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'exception',
    title: 'GPS Signal Lost',
    description: 'Load #SD-45821 - Driver GPS offline for 20 minutes near El Paso, TX',
    time: '2 min ago',
    read: false,
    priority: 'critical',
    loadId: 'SD-45821'
  },
  {
    id: '2',
    type: 'load',
    title: 'Delivery Completed',
    description: 'Load #SD-45820 successfully delivered to Phoenix, AZ. eBOL signed.',
    time: '15 min ago',
    read: false,
    priority: 'low',
    loadId: 'SD-45820'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: 'Invoice #INV-2024-1234 - $2,450.00 payment processed via SuperPay',
    time: '1 hour ago',
    read: false,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'exception',
    title: 'Weather Delay Alert',
    description: 'Severe weather warning on I-40. 3 loads may experience 2+ hour delays.',
    time: '2 hours ago',
    read: true,
    priority: 'high'
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message from Carrier',
    description: 'FastHaul Transport: "Vehicle loaded, departing now. ETA updated."',
    time: '3 hours ago',
    read: true,
    priority: 'low'
  },
  {
    id: '6',
    type: 'load',
    title: 'Pickup Confirmed',
    description: 'Load #SD-45819 picked up from Dallas dealer. Inspection complete.',
    time: '4 hours ago',
    read: true,
    priority: 'low',
    loadId: 'SD-45819'
  },
  {
    id: '7',
    type: 'system',
    title: 'System Maintenance Scheduled',
    description: 'Planned maintenance window: Dec 24, 2:00 AM - 4:00 AM CST',
    time: '5 hours ago',
    read: true,
    priority: 'medium'
  },
  {
    id: '8',
    type: 'payment',
    title: 'Invoice Overdue',
    description: 'Invoice #INV-2024-1198 is 7 days overdue. Amount: $3,200.00',
    time: '1 day ago',
    read: true,
    priority: 'high'
  },
  {
    id: '9',
    type: 'exception',
    title: 'Route Deviation Detected',
    description: 'Load #SD-45815 deviated 25 miles from planned route near Tucson.',
    time: '1 day ago',
    read: true,
    priority: 'high',
    loadId: 'SD-45815'
  },
  {
    id: '10',
    type: 'load',
    title: 'Carrier Assigned',
    description: 'Swift Auto Transport assigned to Load #SD-45822. Pickup tomorrow 9 AM.',
    time: '1 day ago',
    read: true,
    priority: 'low',
    loadId: 'SD-45822'
  }
];
