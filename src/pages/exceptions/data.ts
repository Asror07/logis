import { Clock, Wrench, WifiOff, CloudRain, MapPin, LucideIcon } from 'lucide-react';
import { Exception, ActionDetail, ExceptionType, ExceptionSeverity, ExceptionStatus } from './types';

export const exceptions: Exception[] = [
  {
    id: '1',
    loadId: 'SD-45821',
    type: 'breakdown',
    severity: 'critical',
    message: 'Mechanical issue reported - Engine overheating. Driver pulled over near El Paso, TX.',
    detectedAt: '15 min ago',
    location: 'El Paso, TX',
    driver: 'Mike Johnson',
    carrier: 'Swift Transport',
    affectedEta: '+3.5 hours',
    suggestedActions: ['Dispatch backup carrier', 'Notify shipper of delay', 'Arrange roadside assistance'],
    status: 'open',
    assignedTo: null
  },
  {
    id: '2',
    loadId: 'SD-45834',
    type: 'weather',
    severity: 'warning',
    message: 'Heavy rain and flash flood warnings on I-40. Significant delays expected.',
    detectedAt: '32 min ago',
    location: 'Flagstaff, AZ',
    driver: 'Sarah Wilson',
    carrier: 'Express Auto',
    affectedEta: '+2 hours',
    suggestedActions: ['Monitor weather updates', 'Update ETA notification', 'Consider alternate route'],
    status: 'in_progress',
    assignedTo: 'Alex Johnson'
  },
  {
    id: '3',
    loadId: 'SD-45812',
    type: 'offline',
    severity: 'warning',
    message: 'GPS signal lost for 18 minutes. Last known location: Indianapolis, IN.',
    detectedAt: '45 min ago',
    location: 'Indianapolis, IN',
    driver: 'John Davis',
    carrier: 'National Carriers',
    affectedEta: 'Unknown',
    suggestedActions: ['Contact driver directly', 'Check device status', 'Wait for signal recovery'],
    status: 'open',
    assignedTo: null
  },
  {
    id: '4',
    loadId: 'SD-45798',
    type: 'delay',
    severity: 'info',
    message: 'Driver taking extended break at truck stop. HOS compliance break.',
    detectedAt: '1 hour ago',
    location: 'Sacramento, CA',
    driver: 'Emily Chen',
    carrier: 'Pacific Auto',
    affectedEta: '+45 min',
    suggestedActions: ['No action needed', 'Update customer ETA'],
    status: 'resolved',
    assignedTo: 'Maria Garcia'
  },
];

export const typeIcons: Record<ExceptionType, LucideIcon> = {
  delay: Clock,
  breakdown: Wrench,
  offline: WifiOff,
  weather: CloudRain,
  deviation: MapPin,
};

export const severityStyles: Record<ExceptionSeverity, string> = {
  critical: 'border-l-destructive bg-destructive/5',
  warning: 'border-l-warning bg-warning/5',
  info: 'border-l-info bg-info/5',
};

export const statusColors: Record<ExceptionStatus, string> = {
  open: 'bg-destructive/20 text-destructive',
  in_progress: 'bg-warning/20 text-warning',
  resolved: 'bg-success/20 text-success',
};

export const actionDetails: Record<string, ActionDetail> = {
  'Dispatch backup carrier': {
    description: 'Assign an alternative carrier to complete the delivery when the primary carrier cannot continue.',
    steps: ['Search available carriers in the area', 'Check carrier ratings and capacity', 'Send dispatch request', 'Confirm acceptance and update load'],
    estimatedTime: '15-30 min'
  },
  'Notify shipper of delay': {
    description: 'Send an automated notification to the shipper about the current delay and updated ETA.',
    steps: ['Generate delay notification', 'Include reason and new ETA', 'Send via preferred channel (email/SMS)', 'Log communication in system'],
    estimatedTime: '2-5 min'
  },
  'Arrange roadside assistance': {
    description: 'Contact roadside assistance services to help the driver with mechanical issues.',
    steps: ['Identify issue type', 'Locate nearest service provider', 'Dispatch assistance', 'Track arrival and resolution'],
    estimatedTime: '30-60 min'
  },
  'Monitor weather updates': {
    description: 'Set up real-time weather monitoring for the affected route.',
    steps: ['Enable weather alerts for route', 'Track storm movement', 'Identify safe stopping points', 'Update driver with conditions'],
    estimatedTime: 'Ongoing'
  },
  'Update ETA notification': {
    description: 'Recalculate and send updated estimated time of arrival to all stakeholders.',
    steps: ['Recalculate ETA based on current conditions', 'Update system records', 'Notify shipper and receiver', 'Update tracking portal'],
    estimatedTime: '5 min'
  },
  'Consider alternate route': {
    description: 'Analyze and suggest alternative routes to avoid delays.',
    steps: ['Analyze current traffic and conditions', 'Calculate alternate route options', 'Compare ETAs and costs', 'Send recommendation to driver'],
    estimatedTime: '10 min'
  },
  'Contact driver directly': {
    description: 'Initiate direct communication with the driver to verify status.',
    steps: ['Attempt phone call', 'Send SMS if no answer', 'Try backup contact', 'Document communication attempts'],
    estimatedTime: '5-10 min'
  },
  'Check device status': {
    description: 'Verify the status of the tracking device and connectivity.',
    steps: ['Check device battery level', 'Verify cellular signal strength', 'Review last known data', 'Send remote diagnostic ping'],
    estimatedTime: '5 min'
  },
  'Wait for signal recovery': {
    description: 'Monitor for automatic signal recovery and set alerts.',
    steps: ['Set 30-minute recovery alert', 'Monitor for automatic reconnection', 'Prepare escalation if not recovered', 'Document outage period'],
    estimatedTime: '30 min'
  },
  'No action needed': {
    description: 'This is an informational exception that requires no immediate action.',
    steps: ['Acknowledge the exception', 'Monitor for changes', 'Close if resolved automatically'],
    estimatedTime: 'N/A'
  },
  'Update customer ETA': {
    description: 'Send updated delivery time to the customer.',
    steps: ['Calculate new ETA', 'Generate customer notification', 'Send via preferred channel', 'Update order status'],
    estimatedTime: '2 min'
  }
};
