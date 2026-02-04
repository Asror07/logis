import { Interaction, InteractionStats } from './types';

export const mockInteractions: Interaction[] = [
  {
    id: 'INT-001',
    type: 'sms',
    status: 'delivered',
    timestamp: '2 hours ago',
    loadId: 'SD-45821',
    recipient: { name: 'Sarah Johnson', role: 'shipper', contact: '+1 (555) 123-4567', company: 'Johnson Auto Group' },
    eventType: 'Pickup Complete',
    preview: 'Your 2023 Honda Accord has been picked up from Dallas and is now en route to Phoenix...',
    fullContent: 'Your 2023 Honda Accord has been picked up from Dallas, TX and is now en route to Phoenix, AZ. Estimated delivery: Dec 24, 2025. Track your shipment: https://track.superdispatch.com/SD-45821',
    metrics: { opened: 1, clicked: 1, replied: 0 },
    aiDetails: { model: 'Claude Sonnet 4.5', significanceScore: 0.87, template: 'Pickup Complete - Brief', tokensUsed: 334, generationTime: '0.8s', confidenceScore: 0.92 },
    relatedInteractions: 5,
    cost: '$0.0075',
    notes: [],
    tags: ['VIP']
  },
  {
    id: 'INT-002',
    type: 'ai_call',
    status: 'answered',
    timestamp: '15 min ago',
    loadId: 'SD-45822',
    recipient: { name: "Mike's Transport", role: 'carrier', contact: '+1 (555) 987-6543', company: "Mike's Transport LLC" },
    eventType: 'Delay Notification',
    preview: 'AI called to notify about 2-hour weather delay. Recipient acknowledged and confirmed new schedule.',
    fullContent: 'Automated call regarding weather delay for Load SD-45822. Driver confirmed acknowledgment of 2-hour delay.',
    metrics: { duration: '1:34' },
    callDetails: {
      duration: '1 minute 34 seconds',
      outcome: 'Answered',
      transcript: [
        { time: '00:00', speaker: 'AI Agent', text: "Hello, this is the automated assistant from Super Dispatch calling about your vehicle shipment, Load SD-45822. Am I speaking with someone from Mike's Transport?" },
        { time: '00:08', speaker: "Mike's Transport", text: 'Yes, this is Mike.' },
        { time: '00:10', speaker: 'AI Agent', text: "Great! I'm calling to inform you that the pickup has been delayed by approximately 2 hours due to weather conditions in West Texas. The new estimated pickup time is 4:30 PM today. The vehicle will still arrive at the destination tomorrow as scheduled. Do you have any questions?" },
        { time: '00:28', speaker: "Mike's Transport", text: "No, that's fine. Thanks for letting me know. We'll adjust our schedule." },
        { time: '00:33', speaker: 'AI Agent', text: "Perfect! We'll send you another update once the pickup is complete. Have a great day!" },
        { time: '00:38', speaker: 'System', text: 'Call Ended' }
      ],
      sentiment: 'positive',
      sentimentScore: 0.85,
      topics: ['weather delay', 'schedule adjustment', 'pickup time'],
      actionItems: ['Update pickup time to 4:30 PM', 'Send confirmation after pickup'],
      recordingUrl: '#'
    },
    aiDetails: { model: 'Claude Sonnet 4.5', significanceScore: 0.92, template: 'Delay Notification - Voice', tokensUsed: 456, generationTime: '1.2s', confidenceScore: 0.95 },
    relatedInteractions: 3,
    cost: '$0.045',
    notes: ['Driver confirmed schedule change'],
    tags: ['Weather', 'Delay']
  },
  {
    id: 'INT-003',
    type: 'email',
    status: 'failed',
    timestamp: '30 min ago',
    loadId: 'SD-45823',
    recipient: { name: 'Unknown', role: 'customer', contact: 'invalid@email.com' },
    eventType: 'Invoice Sent',
    preview: 'Invoice for Load SD-45823 - $850. Payment due within 30 days...',
    fullContent: 'Dear Customer,\n\nPlease find attached the invoice for Load SD-45823.\n\nAmount Due: $850.00\nPayment Due: January 22, 2026\n\nThank you for your business.',
    metrics: {},
    relatedInteractions: 1,
    cost: '$0.002',
    notes: ['Email bounced - invalid address'],
    tags: ['Failed', 'Needs Follow-up']
  },
  {
    id: 'INT-004',
    type: 'human_call',
    status: 'answered',
    timestamp: '1 hour ago',
    loadId: 'SD-45824',
    recipient: { name: 'James Wilson', role: 'driver', contact: '+1 (555) 456-7890' },
    eventType: 'Exception Handling',
    preview: 'Dispatcher called driver regarding documentation issue. Driver will upload new photos.',
    fullContent: 'Manual call to resolve documentation issue with vehicle inspection photos.',
    metrics: { duration: '3:45' },
    callDetails: {
      duration: '3 minutes 45 seconds',
      outcome: 'Resolved',
      transcript: [
        { time: '00:00', speaker: 'Dispatcher', text: 'Hi James, this is dispatch. We noticed the inspection photos for Load SD-45824 are blurry. Can you retake them?' },
        { time: '00:12', speaker: 'James Wilson', text: "Oh, I'm sorry about that. I can take new ones right now if you want." },
        { time: '00:18', speaker: 'Dispatcher', text: "That would be great. Make sure to get clear shots of all four corners and the VIN." },
        { time: '00:25', speaker: 'James Wilson', text: "Got it. I'll upload them in the next 10 minutes." },
        { time: '00:30', speaker: 'Dispatcher', text: 'Perfect, thank you James!' }
      ],
      sentiment: 'positive',
      sentimentScore: 0.78,
      topics: ['documentation', 'photos', 'vehicle inspection'],
      actionItems: ['Driver to upload new photos within 10 minutes']
    },
    relatedInteractions: 2,
    cost: '$0.12',
    notes: ['Issue resolved - awaiting new photos'],
    tags: ['Documentation', 'Resolved']
  },
  {
    id: 'INT-005',
    type: 'push',
    status: 'delivered',
    timestamp: '45 min ago',
    loadId: 'SD-45825',
    recipient: { name: 'David Chen', role: 'broker', contact: 'david.chen@brokerco.com', company: 'BrokerCo Inc.' },
    eventType: 'Approaching Delivery',
    preview: 'Vehicle arriving in 30 minutes. ETA: 3:00 PM at Phoenix drop-off location.',
    fullContent: 'Load SD-45825 Update: Your 2024 Tesla Model 3 is 30 minutes away from the delivery location. ETA: 3:00 PM. The recipient has been notified.',
    metrics: { opened: 1 },
    relatedInteractions: 4,
    cost: '$0.001',
    notes: [],
    tags: []
  },
  {
    id: 'INT-006',
    type: 'ai_call',
    status: 'no_answer',
    timestamp: '2 hours ago',
    loadId: 'SD-45826',
    recipient: { name: 'Linda Martinez', role: 'shipper', contact: '+1 (555) 234-5678' },
    eventType: 'Delivery Confirmation',
    preview: 'Attempted to confirm delivery window. No answer - left voicemail.',
    fullContent: 'Automated call to confirm delivery window for tomorrow. Recipient did not answer.',
    metrics: { duration: '0:45' },
    callDetails: {
      duration: '45 seconds',
      outcome: 'Voicemail',
      transcript: [
        { time: '00:00', speaker: 'System', text: 'Call initiated' },
        { time: '00:25', speaker: 'System', text: 'No answer - routing to voicemail' },
        { time: '00:30', speaker: 'AI Agent', text: "Hello, this is Super Dispatch calling about your vehicle delivery scheduled for tomorrow. Please call us back at 1-800-DISPATCH or check your email for details. Thank you!" },
        { time: '00:45', speaker: 'System', text: 'Call Ended' }
      ],
      sentiment: 'neutral',
      sentimentScore: 0.5,
      topics: ['delivery confirmation', 'voicemail'],
      actionItems: ['Follow up via SMS', 'Retry call in 2 hours']
    },
    relatedInteractions: 6,
    cost: '$0.015',
    notes: ['Will retry call in 2 hours'],
    tags: ['Needs Follow-up']
  },
  {
    id: 'INT-007',
    type: 'webhook',
    status: 'delivered',
    timestamp: '3 hours ago',
    loadId: 'SD-45827',
    recipient: { name: 'TMS Integration', role: 'carrier', contact: 'api.carrier.com/webhook' },
    eventType: 'GPS Update',
    preview: 'Location update sent to carrier TMS. Lat: 32.7767, Lng: -96.7970',
    fullContent: '{"event":"location_update","load_id":"SD-45827","coordinates":{"lat":32.7767,"lng":-96.7970},"speed":65,"heading":"SW","timestamp":"2025-12-23T14:30:00Z"}',
    metrics: {},
    relatedInteractions: 12,
    cost: '$0.0001',
    notes: [],
    tags: ['Automated', 'API']
  },
  {
    id: 'INT-008',
    type: 'sms',
    status: 'responded',
    timestamp: '4 hours ago',
    loadId: 'SD-45828',
    recipient: { name: 'Robert Taylor', role: 'customer', contact: '+1 (555) 345-6789', company: 'Taylor Automotive' },
    eventType: 'Delivery Complete',
    preview: 'Your vehicle has been delivered! Customer replied: "Thank you, everything looks great!"',
    fullContent: 'Great news! Your 2023 BMW X5 has been successfully delivered to 123 Main St, Scottsdale, AZ. Please inspect the vehicle and confirm receipt. Questions? Reply to this message.',
    metrics: { opened: 1, clicked: 0, replied: 1 },
    relatedInteractions: 8,
    cost: '$0.0075',
    notes: ['Customer satisfied with delivery'],
    tags: ['Completed', 'Positive Feedback']
  }
];

export const stats: InteractionStats = {
  total: 1247,
  sms: 892,
  email: 245,
  calls: 98,
  push: 12
};
