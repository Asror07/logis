import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Eye, Edit, Trash2, MoreHorizontal, Container } from 'lucide-react';
import { Trailer, assetStatusConfig, trailerTypeConfig } from '../types';

interface TrailersTableProps {
  trailers: Trailer[];
  onView: (trailer: Trailer) => void;
  onEdit: (trailer: Trailer) => void;
  onDelete: (trailer: Trailer) => void;
}

export function TrailersTable({ trailers, onView, onEdit, onDelete }: TrailersTableProps) {
  if (trailers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Container className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No trailers found</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">Add your first trailer to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Container className="h-5 w-5 text-primary" />
          Trailers ({trailers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trailer #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trailers.map((trailer) => {
              const statusConfig = assetStatusConfig[trailer.status];
              const typeConfig = trailerTypeConfig[trailer.type];
              return (
                <TableRow key={trailer.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(trailer)}>
                  <TableCell className="font-medium">{trailer.trailerNumber}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{trailer.capacity}</span>
                    <span className="text-muted-foreground text-sm ml-1">units</span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{trailer.licensePlate || '—'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        trailer.status === 'active' && 'border-green-500/50 text-green-400 bg-green-500/10',
                        trailer.status === 'maintenance' && 'border-orange-500/50 text-orange-400 bg-orange-500/10',
                        trailer.status === 'out-of-service' && 'border-destructive/50 text-destructive bg-destructive/10'
                      )}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {trailer.currentLocation || '—'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(trailer); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(trailer); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); onDelete(trailer); }}
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
