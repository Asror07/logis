import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { AssetStatus } from '../types';

interface AssetsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddNew: () => void;
  assetType: 'trucks' | 'trailers';
}

export function AssetsHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddNew,
  assetType,
}: AssetsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${assetType}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="out-of-service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="gradient" onClick={onAddNew}>
        <Plus className="h-4 w-4 mr-1" />
        Add {assetType === 'trucks' ? 'Truck' : 'Trailer'}
      </Button>
    </div>
  );
}
