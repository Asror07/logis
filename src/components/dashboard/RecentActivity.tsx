import { MessageSquare, Mail, Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'sms' | 'email' | 'push';
  loadId: string;
  recipient: string;
  status: 'delivered' | 'pending' | 'failed';
  time: string;
}

const activities: Activity[] = [
  { id: '1', type: 'sms', loadId: 'SD-45821', recipient: 'John Smith', status: 'delivered', time: '2 min ago' },
  { id: '2', type: 'email', loadId: 'SD-45834', recipient: 'ABC Logistics', status: 'delivered', time: '5 min ago' },
  { id: '3', type: 'push', loadId: 'SD-45812', recipient: 'Driver Mike', status: 'pending', time: '8 min ago' },
  { id: '4', type: 'sms', loadId: 'SD-45798', recipient: 'Jane Doe', status: 'delivered', time: '12 min ago' },
  { id: '5', type: 'email', loadId: 'SD-45776', recipient: 'XYZ Carriers', status: 'failed', time: '15 min ago' },
];

const typeIcons = {
  sms: MessageSquare,
  email: Mail,
  push: Bell,
};

const statusIcons = {
  delivered: CheckCircle,
  pending: Clock,
  failed: AlertCircle,
};

const statusColors = {
  delivered: 'text-success',
  pending: 'text-warning',
  failed: 'text-destructive',
};

export function RecentActivity() {
  return (
    <Card variant="glow">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest notifications sent</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const TypeIcon = typeIcons[activity.type];
            const StatusIcon = statusIcons[activity.status];
            
            return (
              <div 
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TypeIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.loadId}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm text-muted-foreground truncate">{activity.recipient}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <StatusIcon className={cn("h-5 w-5", statusColors[activity.status])} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
