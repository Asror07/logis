import { AlertTriangle, Clock, MapPin, Wrench, ChevronRight, Truck, Phone, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Exception {
  id: string;
  type: 'delay' | 'breakdown' | 'offline' | 'deviation';
  loadId: string;
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
  driver?: string;
  location?: string;
}

const exceptions: Exception[] = [
  {
    id: '1',
    type: 'breakdown',
    loadId: 'SD-45821',
    message: 'Mechanical issue reported near El Paso, TX',
    time: '15 min ago',
    severity: 'critical',
    driver: 'Mike Thompson',
    location: 'El Paso, TX'
  },
  {
    id: '2',
    type: 'delay',
    loadId: 'SD-45834',
    message: 'Weather delay - Heavy rain on I-40',
    time: '32 min ago',
    severity: 'warning',
    driver: 'Sarah Johnson',
    location: 'Amarillo, TX'
  },
  {
    id: '3',
    type: 'offline',
    loadId: 'SD-45812',
    message: 'GPS signal lost for 18 minutes',
    time: '45 min ago',
    severity: 'warning',
    driver: 'John Davis',
    location: 'Oklahoma City, OK'
  },
  {
    id: '4',
    type: 'deviation',
    loadId: 'SD-45867',
    message: 'Route deviation detected - 15 miles off planned route',
    time: '1 hour ago',
    severity: 'info',
    driver: 'Emily Chen',
    location: 'Tucson, AZ'
  },
  {
    id: '5',
    type: 'delay',
    loadId: 'SD-45899',
    message: 'Traffic congestion on I-10 - ETA delayed by 2 hours',
    time: '1.5 hours ago',
    severity: 'warning',
    driver: 'Robert Wilson',
    location: 'Houston, TX'
  },
  {
    id: '6',
    type: 'breakdown',
    loadId: 'SD-45901',
    message: 'Tire blowout reported - Roadside assistance dispatched',
    time: '2 hours ago',
    severity: 'critical',
    driver: 'Lisa Anderson',
    location: 'Phoenix, AZ'
  },
];

const iconMap = {
  delay: Clock,
  breakdown: Wrench,
  offline: AlertTriangle,
  deviation: MapPin,
};

const severityStyles = {
  critical: 'border-l-destructive bg-destructive/5',
  warning: 'border-l-warning bg-warning/5',
  info: 'border-l-info bg-info/5',
};

interface ExceptionPanelProps {
  className?: string;
  expanded?: boolean;
}

export function ExceptionPanel({ className, expanded = false }: ExceptionPanelProps) {
  const displayedExceptions = expanded ? exceptions : exceptions.slice(0, 3);

  return (
    <Card variant="glow" className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>Active Exceptions</CardTitle>
          <Badge variant="destructive">{exceptions.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className={cn("space-y-3", expanded && "max-h-[400px] overflow-y-auto")}>
        {displayedExceptions.map((exception, index) => {
          const Icon = iconMap[exception.type];
          return (
            <div
              key={exception.id}
              className={cn(
                "p-4 rounded-lg border-l-4 flex items-start gap-4 transition-all duration-300 hover:translate-x-1 cursor-pointer animate-fade-in",
                severityStyles[exception.severity]
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                exception.severity === 'critical' && "bg-destructive/20 text-destructive",
                exception.severity === 'warning' && "bg-warning/20 text-warning",
                exception.severity === 'info' && "bg-info/20 text-info"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{exception.loadId}</span>
                  <Badge variant={exception.severity === 'critical' ? 'destructive' : exception.severity === 'warning' ? 'warning' : 'info'}>
                    {exception.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{exception.message}</p>
                {expanded && exception.driver && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      {exception.driver}
                    </div>
                    {exception.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {exception.location}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{exception.time}</p>
                  {expanded && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
