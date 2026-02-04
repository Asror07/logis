import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Truck, TruckFormData, AssetStatus } from '../types';

interface TruckEditModalProps {
  truck: Truck | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: TruckFormData) => void;
}

export function TruckEditModal({ truck, open, onOpenChange, onSubmit }: TruckEditModalProps) {
  const [formData, setFormData] = useState<TruckFormData>({
    unitNumber: '',
    vin: '',
    licensePlate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'active',
  });

  useEffect(() => {
    if (truck) {
      setFormData({
        unitNumber: truck.unitNumber,
        vin: truck.vin,
        licensePlate: truck.licensePlate,
        make: truck.make,
        model: truck.model,
        year: truck.year,
        status: truck.status,
        assignedDriverId: truck.assignedDriverId,
        assignedDriverName: truck.assignedDriverName,
        currentLocation: truck.currentLocation,
        mileage: truck.mileage,
        lastServiceDate: truck.lastServiceDate,
        nextServiceDue: truck.nextServiceDue,
        insuranceExpiry: truck.insuranceExpiry,
        registrationExpiry: truck.registrationExpiry,
        notes: truck.notes,
      });
    }
  }, [truck]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (truck) {
      onSubmit(truck.id, formData);
      onOpenChange(false);
    }
  };

  const updateField = <K extends keyof TruckFormData>(key: K, value: TruckFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Truck</DialogTitle>
          <DialogDescription>Update the truck details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                value={formData.unitNumber}
                onChange={(e) => updateField('unitNumber', e.target.value)}
                placeholder="T-1001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => updateField('licensePlate', e.target.value)}
                placeholder="ABC 1234"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN *</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => updateField('vin', e.target.value)}
              placeholder="1XKWD49X8AJ123456"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => updateField('make', e.target.value)}
                placeholder="Peterbilt"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateField('model', e.target.value)}
                placeholder="579"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => updateField('year', parseInt(e.target.value))}
                min={2000}
                max={2030}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: AssetStatus) => updateField('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => updateField('mileage', parseInt(e.target.value) || 0)}
                placeholder="125000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentLocation">Current Location</Label>
            <Input
              id="currentLocation"
              value={formData.currentLocation || ''}
              onChange={(e) => updateField('currentLocation', e.target.value)}
              placeholder="Phoenix, AZ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
