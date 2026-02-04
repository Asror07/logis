import { Button } from '@/components/ui/button';

interface AnalyticsHeaderProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function AnalyticsHeader({ timeRange, setTimeRange }: AnalyticsHeaderProps) {
  return (
    <div className="relative flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep-dive into ROI and communication effectiveness</p>
      </div>
      <div className="flex gap-2">
        {['week', 'month', 'quarter'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
            className="capitalize"
          >
            {range}
          </Button>
        ))}
      </div>
    </div>
  );
}
