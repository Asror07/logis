import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { ROIMetric } from '../types';

interface ROIMetricsCardsProps {
  metrics: ROIMetric[];
}

export function ROIMetricsCards({ metrics }: ROIMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.label}
            variant="stat"
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.subtext}</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+{metric.trend}%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-button">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
