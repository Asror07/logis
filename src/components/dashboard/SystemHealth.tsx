import { Activity, Wifi, Database, Server } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthMetric {
  name: string;
  icon: React.ElementType;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  detail: string;
}

const metrics: HealthMetric[] = [
  { name: 'API Gateway', icon: Server, status: 'healthy', value: '99.9%', detail: 'Uptime' },
  { name: 'Database', icon: Database, status: 'healthy', value: '12ms', detail: 'Latency' },
  { name: 'Message Queue', icon: Activity, status: 'warning', value: '847', detail: 'Pending' },
  { name: 'GPS Tracking', icon: Wifi, status: 'healthy', value: '2,341', detail: 'Active' },
];

const statusColors = {
  healthy: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-destructive',
};

export function SystemHealth() {
  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">System Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.name}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{metric.name}</p>
                <p className="text-xs text-muted-foreground">{metric.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{metric.value}</p>
                <span className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  statusColors[metric.status]
                )} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
