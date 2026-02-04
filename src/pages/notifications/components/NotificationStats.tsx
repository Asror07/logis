import { Card } from '@/components/ui/card';
import { Notification, NotificationType } from '../types';
import { getTypeIcon, getTypeColor } from '../utils';

interface NotificationStatsProps {
  notifications: Notification[];
}

const statTypes: { type: NotificationType; label: string }[] = [
  { type: 'load', label: 'Load Updates' },
  { type: 'exception', label: 'Exceptions' },
  { type: 'payment', label: 'Payments' },
  { type: 'message', label: 'Messages' },
  { type: 'system', label: 'System' },
];

export function NotificationStats({ notifications }: NotificationStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statTypes.map((stat) => {
        const count = notifications.filter((n) => n.type === stat.type).length;
        return (
          <Card key={stat.type} variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(stat.type)}`}>
                {getTypeIcon(stat.type)}
              </div>
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
