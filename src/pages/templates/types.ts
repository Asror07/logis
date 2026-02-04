export type TemplateType = 'pickup' | 'transit' | 'delivery' | 'exception' | 'payment';
export type TemplateChannel = 'sms' | 'email' | 'push';

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  channel: TemplateChannel;
  content: string;
  variables: string[];
  usageCount: number;
  lastUsed: string;
  isSystem: boolean;
}