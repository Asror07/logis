export type UserRole = 'driver' | 'carrier' | 'broker' | 'shipper' | 'customer';
export type UserStatus = 'online' | 'offline' | 'away';
export type MessageType = 'text' | 'sms' | 'email' | 'ai_call' | 'human_call' | 'system' | 'audio';
export type MessageSender = 'ai' | 'human' | 'user' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: UserRole;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isAIEnabled: boolean;
  status: UserStatus;
}

export interface AIDetails {
  model: string;
  confidenceScore: number;
  tokensUsed: number;
  wasEdited: boolean;
}

export interface CallDetails {
  duration: string;
  recordingUrl?: string;
  transcript?: TranscriptEntry[];
}

export interface TranscriptEntry {
  time: string;
  speaker: string;
  text: string;
}

export interface Attachment {
  type: string;
  name: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  sender: MessageSender;
  content: string;
  timestamp: string;
  status: MessageStatus;
  subject?: string; // for emails
  aiDetails?: AIDetails;
  callDetails?: CallDetails;
  attachments?: Attachment[];
}

export interface Conversation {
  userId: string;
  messages: ChatMessage[];
}
