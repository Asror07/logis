import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Edit, MapPin, Calendar, Package, FileText } from 'lucide-react';
import { Trailer, assetStatusConfig, trailerTypeConfig } from '../types';

interface TrailerDetailsModalProps {
  trailer: Trailer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (trailer: Trailer) => void;
}

export function TrailerDetailsModal({ trailer, open, onOpenChange, onEdit }: TrailerDetailsModalProps) {
  if (!trailer) return null;

  const statusConfig = assetStatusConfig[trailer.status];
  const typeConfig = trailerTypeConfig[trailer.type];

  const detailSections = [
    {
      title: 'Trailer Information',
      items: [
        { label: 'Trailer Number', value: trailer.trailerNumber },
        { label: 'Type', value: typeConfig.label },
        { label: 'Capacity', value: `${trailer.capacity} units`, icon: Package },
        { label: 'VIN', value: trailer.vin || '—', mono: true },
        { label: 'License Plate', value: trailer.licensePlate || '—', mono: true },
      ],
    },
    {
      title: 'Location',
      items: [
        { label: 'Current Location', value: trailer.currentLocation || 'Unknown', icon: MapPin },
      ],
    },
    {
      title: 'Inspections',
      items: [
        { label: 'Last Inspection', value: trailer.lastInspectionDate || '—', icon: Calendar },
        { label: 'Next Inspection Due', value: trailer.nextInspectionDue || '—', icon: Calendar },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{trailer.trailerNumber}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{typeConfig.label}</p>
            </div>
            <div className="flex items-center gap-2">
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
              <Button variant="outline" size="sm" onClick={() => onEdit(trailer)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {detailSections.map((section, idx) => (
            <div key={section.title}>
              {idx > 0 && <Separator className="mb-4" />}
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{section.title}</h4>
              <div className="grid gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.label}
                      </div>
                      <span className={cn('text-sm font-medium', item.mono && 'font-mono')}>
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {trailer.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                <p className="text-sm bg-muted/50 rounded-lg p-3">{trailer.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
