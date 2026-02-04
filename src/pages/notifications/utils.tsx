import { Badge } from '@/components/ui/badge';
import {
  Truck,
  AlertTriangle,
  DollarSign,
  MessageSquare,
  Settings
} from 'lucide-react';
import { NotificationType, NotificationPriority } from './types';

export const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'load':
      return <Truck className="h-5 w-5" />;
    case 'exception':
      return <AlertTriangle className="h-5 w-5" />;
    case 'payment':
      return <DollarSign className="h-5 w-5" />;
    case 'message':
      return <MessageSquare className="h-5 w-5" />;
    case 'system':
      return <Settings className="h-5 w-5" />;
  }
};

export const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case 'load':
      return 'bg-info/20 text-info';
    case 'exception':
      return 'bg-destructive/20 text-destructive';
    case 'payment':
      return 'bg-success/20 text-success';
    case 'message':
      return 'bg-primary/20 text-primary';
    case 'system':
      return 'bg-muted text-muted-foreground';
  }
};

export const getPriorityBadge = (priority: NotificationPriority) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive" className="animate-pulse">Critical</Badge>;
    case 'high':
      return <Badge className="bg-warning text-warning-foreground">High</Badge>;
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>;
    case 'low':
      return <Badge variant="outline">Low</Badge>;
  }
};
