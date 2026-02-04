import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCheck, Trash2 } from 'lucide-react';

interface NotificationsHeaderProps {
  unreadCount: number;
  totalCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationsHeader({
  unreadCount,
  totalCount,
  onMarkAllAsRead,
  onClearAll
}: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Notifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Stay updated on loads, exceptions, and communications
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="glow" className="text-sm px-3 py-1">
          {unreadCount} unread
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark all read
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          disabled={totalCount === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      </div>
    </div>
  );
}
