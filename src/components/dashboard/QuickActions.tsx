import { Pause, Send, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const actions = [
  { icon: Pause, label: 'Pause All', variant: 'outline' as const },
  { icon: Send, label: 'Bulk Send', variant: 'gradient' as const },
  { icon: Settings, label: 'Configure', variant: 'outline' as const },
  { icon: Download, label: 'Export', variant: 'outline' as const },
];

export function QuickActions() {
  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.variant}
                className="h-auto py-3 flex-col gap-2"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
