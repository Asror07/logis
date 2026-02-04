import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ReportsHeader() {
  return (
    <div className="relative flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Reports & Export Center</h1>
        <p className="text-muted-foreground mt-1">Generate comprehensive reports and export data</p>
      </div>
      <Button variant="gradient">
        <Plus className="h-4 w-4 mr-1" />
        Custom Report
      </Button>
    </div>
  );
}