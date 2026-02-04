import { Button } from '@/components/ui/button';

interface ExceptionsFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const statusOptions = ['all', 'open', 'in_progress', 'resolved'];

export function ExceptionsFilters({ statusFilter, onStatusFilterChange }: ExceptionsFiltersProps) {
  return (
    <div className="flex gap-2">
      {statusOptions.map((status) => (
        <Button
          key={status}
          variant={statusFilter === status ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusFilterChange(status)}
          className="capitalize"
        >
          {status.replace('_', ' ')}
        </Button>
      ))}
    </div>
  );
}
