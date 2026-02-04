import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Eye, Edit, Trash2, MoreHorizontal, Truck as TruckIcon } from 'lucide-react';
import { Truck, assetStatusConfig } from '../types';

interface TrucksTableProps {
  trucks: Truck[];
  onView: (truck: Truck) => void;
  onEdit: (truck: Truck) => void;
  onDelete: (truck: Truck) => void;
}

export function TrucksTable({ trucks, onView, onEdit, onDelete }: TrucksTableProps) {
  if (trucks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TruckIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No trucks found</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">Add your first truck to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TruckIcon className="h-5 w-5 text-primary" />
          Trucks ({trucks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit #</TableHead>
              <TableHead>Make / Model</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks.map((truck) => {
              const statusConfig = assetStatusConfig[truck.status];
              return (
                <TableRow key={truck.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(truck)}>
                  <TableCell className="font-medium">{truck.unitNumber}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{truck.year} {truck.make}</span>
                      <span className="text-muted-foreground ml-1">{truck.model}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{truck.licensePlate}</TableCell>
                  <TableCell>
                    {truck.assignedDriverName || (
                      <span className="text-muted-foreground text-sm">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        truck.status === 'active' && 'border-green-500/50 text-green-400 bg-green-500/10',
                        truck.status === 'maintenance' && 'border-orange-500/50 text-orange-400 bg-orange-500/10',
                        truck.status === 'out-of-service' && 'border-destructive/50 text-destructive bg-destructive/10'
                      )}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {truck.currentLocation || '—'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(truck); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(truck); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); onDelete(truck); }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
