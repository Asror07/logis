import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Clock, FileText } from 'lucide-react';
import { Notification } from '../types';
import { getTypeIcon, getTypeColor, getPriorityBadge } from '../utils';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <Card variant="glass" className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          variant="glass"
          className={`p-4 transition-all duration-300 hover:shadow-lg ${
            !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`p-3 rounded-xl shrink-0 ${getTypeColor(notification.type)}`}
            >
              {getTypeIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4
                  className={`font-semibold ${
                    !notification.read
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {notification.title}
                </h4>
                {getPriorityBadge(notification.priority)}
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {notification.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {notification.time}
                </span>
                {notification.loadId && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {notification.loadId}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(notification.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}