import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exception } from '../types';
import { typeIcons, severityStyles, statusColors } from '../data';

interface ExceptionQueueProps {
  exceptions: Exception[];
  selectedExceptionId: string | null;
  onSelectException: (exception: Exception) => void;
}

export function ExceptionQueue({ exceptions, selectedExceptionId, onSelectException }: ExceptionQueueProps) {
  return (
    <Card variant="glow">
      <CardHeader>
        <CardTitle>Exception Queue</CardTitle>
        <p className="text-sm text-muted-foreground">Prioritized by severity and age</p>
      </CardHeader>
      <CardContent className="p-0 max-h-[600px] overflow-y-auto">
        {exceptions.map((exception, index) => {
          const Icon = typeIcons[exception.type];
          return (
            <button
              key={exception.id}
              onClick={() => onSelectException(exception)}
              className={cn(
                "w-full p-4 border-l-4 border-b border-border/50 text-left hover:bg-secondary/30 transition-all animate-fade-in",
                severityStyles[exception.severity],
                selectedExceptionId === exception.id && "ring-2 ring-primary ring-inset"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
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
                    <span className="font-bold">{exception.loadId}</span>
                    <Badge className={statusColors[exception.status]}>
                      {exception.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{exception.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exception.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {exception.detectedAt}
                    </span>
                    <span className="text-primary font-medium">
                      ETA: {exception.affectedEta}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
