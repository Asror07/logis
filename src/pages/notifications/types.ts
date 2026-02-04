export type NotificationType = 'load' | 'exception' | 'payment' | 'message' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: NotificationPriority;
  loadId?: string;
}
