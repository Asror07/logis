import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Edit, MapPin, Calendar, Gauge, Shield, FileText, User } from 'lucide-react';
import { Truck, assetStatusConfig } from '../types';

interface TruckDetailsModalProps {
  truck: Truck | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (truck: Truck) => void;
}

export function TruckDetailsModal({ truck, open, onOpenChange, onEdit }: TruckDetailsModalProps) {
  if (!truck) return null;

  const statusConfig = assetStatusConfig[truck.status];

  const detailSections = [
    {
      title: 'Vehicle Information',
      items: [
        { label: 'Unit Number', value: truck.unitNumber },
        { label: 'Make / Model', value: `${truck.year} ${truck.make} ${truck.model}` },
        { label: 'VIN', value: truck.vin, mono: true },
        { label: 'License Plate', value: truck.licensePlate, mono: true },
        { label: 'Mileage', value: truck.mileage ? `${truck.mileage.toLocaleString()} mi` : '—' },
      ],
    },
    {
      title: 'Assignment',
      items: [
        { label: 'Assigned Driver', value: truck.assignedDriverName || 'Unassigned', icon: User },
        { label: 'Current Location', value: truck.currentLocation || 'Unknown', icon: MapPin },
      ],
    },
    {
      title: 'Service & Compliance',
      items: [
        { label: 'Last Service', value: truck.lastServiceDate || '—', icon: Calendar },
        { label: 'Next Service Due', value: truck.nextServiceDue || '—', icon: Calendar },
        { label: 'Insurance Expiry', value: truck.insuranceExpiry || '—', icon: Shield },
        { label: 'Registration Expiry', value: truck.registrationExpiry || '—', icon: FileText },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{truck.unitNumber}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {truck.year} {truck.make} {truck.model}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
              <Button variant="outline" size="sm" onClick={() => onEdit(truck)}>
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

          {truck.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                <p className="text-sm bg-muted/50 rounded-lg p-3">{truck.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
