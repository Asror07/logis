export interface Interaction {
  id: string;
  type: 'sms' | 'email' | 'ai_call' | 'human_call' | 'push' | 'webhook';
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'responded' | 'failed' | 'bounced' | 'answered' | 'no_answer' | 'busy';
  timestamp: string;
  loadId: string;
  recipient: {
    name: string;
    role: 'shipper' | 'broker' | 'carrier' | 'driver' | 'customer';
    contact: string;
    company?: string;
  };
  eventType: string;
  preview: string;
  fullContent: string;
  metrics: {
    opened?: number;
    clicked?: number;
    replied?: number;
    duration?: string;
  };
  callDetails?: {
    duration: string;
    outcome: string;
    transcript: { time: string; speaker: string; text: string }[];
    sentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number;
    topics: string[];
    actionItems: string[];
    recordingUrl?: string;
  };
  aiDetails?: {
    model: string;
    significanceScore: number;
    template: string;
    tokensUsed: number;
    generationTime: string;
    confidenceScore: number;
  };
  relatedInteractions: number;
  cost: string;
  notes: string[];
  tags: string[];
}

export interface InteractionStats {
  total: number;
  sms: number;
  email: number;
  calls: number;
  push: number;
}

export interface ExpandedFilters {
  type: boolean;
  status: boolean;
  event: boolean;
  recipient: boolean;
  load: boolean;
  additional: boolean;
}
