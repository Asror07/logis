import { AlertTriangle, Clock } from 'lucide-react';

interface ExceptionsHeaderProps {
  openCount: number;
  inProgressCount: number;
}

export function ExceptionsHeader({ openCount, inProgressCount }: ExceptionsHeaderProps) {
  return (
    <div className="relative flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Exception Management Center</h1>
        <p className="text-muted-foreground mt-1">Handle exceptions and urgent situations</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="font-semibold text-destructive">{openCount} Open</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-lg">
          <Clock className="h-5 w-5 text-warning" />
          <span className="font-semibold text-warning">{inProgressCount} In Progress</span>
        </div>
      </div>
    </div>
  );
}
