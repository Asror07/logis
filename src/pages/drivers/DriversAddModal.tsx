import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState, useEffect } from 'react'
import { useCreateDriverMutation, getDriverErrorMessage } from './useDrivers'
import type { CreateDriverDto, VehicleType } from './type'

interface DriversAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const initialFormData: CreateDriverDto = {
  full_name: '',
  email: '',
  phone: '',
  vehicle: '',
  vehicle_type: 'semi_truck',
  license_number: '',
  license_expiry: '',
  home_base: '',
  emergency_name: '',
  emergency_phone: '',
  emergency_relationship: '',
  notes: '',
}

export default function DriversAddModal({ open, onOpenChange, onSuccess }: DriversAddModalProps) {
  const [formData, setFormData] = useState<CreateDriverDto>(initialFormData)
  const [createDriver, { isLoading, error, reset }] = useCreateDriverMutation()

  // Reset form and error state when modal closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData)
      reset()
    }
  }, [open, reset])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createDriver(formData).unwrap()
      setFormData(initialFormData)
      onOpenChange(false)
      onSuccess?.()
    } catch {
      // Error handled by RTK Query state
    }
  }

  const handleChange = (field: keyof CreateDriverDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>Enter the driver's information below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{getDriverErrorMessage(error)}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange('phone')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="home_base">Home Base *</Label>
              <Input
                id="home_base"
                value={formData.home_base}
                onChange={handleChange('home_base')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="vehicle">Vehicle *</Label>
              <Input
                id="vehicle"
                value={formData.vehicle}
                onChange={handleChange('vehicle')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Vehicle Type *</Label>
              <Select
                value={formData.vehicle_type}
                onValueChange={(value: VehicleType) => setFormData(prev => ({ ...prev, vehicle_type: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semi_truck">Semi Truck</SelectItem>
                  <SelectItem value="box_truck">Box Truck</SelectItem>
                  <SelectItem value="sprinter">Sprinter Van</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_number">License Number *</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={handleChange('license_number')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_expiry">License Expiry *</Label>
              <Input
                id="license_expiry"
                type="date"
                value={formData.license_expiry}
                onChange={handleChange('license_expiry')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="col-span-2 border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_name">Name *</Label>
                  <Input
                    id="emergency_name"
                    value={formData.emergency_name}
                    onChange={handleChange('emergency_name')}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Phone *</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleChange('emergency_phone')}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_relationship">Relationship *</Label>
                  <Input
                    id="emergency_relationship"
                    value={formData.emergency_relationship}
                    onChange={handleChange('emergency_relationship')}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add Driver'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
