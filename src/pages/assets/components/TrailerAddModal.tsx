import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TrailerFormData, AssetStatus, TrailerType } from '../types';

interface TrailerAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TrailerFormData) => void;
}

const defaultFormData: TrailerFormData = {
  trailerNumber: '',
  type: 'car-hauler',
  status: 'active',
  capacity: 8,
};

export function TrailerAddModal({ open, onOpenChange, onSubmit }: TrailerAddModalProps) {
  const [formData, setFormData] = useState<TrailerFormData>(defaultFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(defaultFormData);
    onOpenChange(false);
  };

  const updateField = <K extends keyof TrailerFormData>(key: K, value: TrailerFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trailer</DialogTitle>
          <DialogDescription>Enter the trailer details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trailerNumber">Trailer Number *</Label>
              <Input
                id="trailerNumber"
                value={formData.trailerNumber}
                onChange={(e) => updateField('trailerNumber', e.target.value)}
                placeholder="TR-2001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TrailerType) => updateField('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car-hauler">Car Hauler</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                  <SelectItem value="dry-van">Dry Van</SelectItem>
                  <SelectItem value="reefer">Reefer</SelectItem>
                  <SelectItem value="lowboy">Lowboy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (units) *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => updateField('capacity', parseInt(e.target.value))}
                min={1}
                max={20}
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate || ''}
                onChange={(e) => updateField('licensePlate', e.target.value)}
                placeholder="TRL 1111"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin || ''}
                onChange={(e) => updateField('vin', e.target.value)}
                placeholder="TRAILER001VIN12345"
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
              Add Trailer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
