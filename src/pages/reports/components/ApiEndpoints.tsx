import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function ApiEndpoints() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          API Endpoints
        </CardTitle>
        <p className="text-sm text-muted-foreground">Programmatic access to report data</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <code className="text-sm text-primary font-mono">GET /api/v1/analytics/summary</code>
            <p className="text-xs text-muted-foreground mt-2">Retrieve analytics summary for date range</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <code className="text-sm text-primary font-mono">GET /api/v1/reports/generate</code>
            <p className="text-xs text-muted-foreground mt-2">Generate custom report with parameters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}