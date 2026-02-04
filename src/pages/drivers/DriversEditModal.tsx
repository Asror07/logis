import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type {
  DriverResponse,
  DriverStatus,
  UpdateDriverDto,
  VehicleType,
} from "./type";
import {
  getDriverErrorMessage,
  useDriver,
  useUpdateDriverMutation,
} from "./useDrivers";

interface DriversEditModalProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
  selectedDriver: DriverResponse | null;
  onSuccess?: () => void;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicle_type: VehicleType;
  license_number: string;
  license_expiry: string;
  home_base: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_relationship: string;
  notes: string;
  status: DriverStatus;
}

const initialFormData: FormData = {
  full_name: "",
  email: "",
  phone: "",
  vehicle: "",
  vehicle_type: "semi_truck",
  license_number: "",
  license_expiry: "",
  home_base: "",
  emergency_name: "",
  emergency_phone: "",
  emergency_relationship: "",
  notes: "",
  status: "active",
};

export default function DriversEditModal({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedDriver,
  onSuccess,
}: DriversEditModalProps) {
  const {
    driver,
    isLoading: dataLoading,
    isError,
    error: dataError,
  } = useDriver(selectedDriver?.id);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [updateDriver, { isLoading, error, reset }] = useUpdateDriverMutation();

  // Populate form when modal opens with selected driver
  useEffect(() => {
    if (isEditDialogOpen && driver) {
      setFormData({
        full_name: driver.full_name,
        email: driver.email,
        phone: driver.phone,
        vehicle: driver.vehicle,
        vehicle_type: driver.vehicle_type,
        license_number: driver.license_number,
        license_expiry:
          driver.license_expiry?.split("T")[0] || driver.license_expiry,
        home_base: driver.home_base,
        emergency_name: driver.emergency_name,
        emergency_phone: driver.emergency_phone,
        emergency_relationship: driver.emergency_relationship,
        notes: driver.notes || "",
        status: driver.status,
      });
    }
  }, [isEditDialogOpen, driver]);

  // Reset form and error when modal closes
  useEffect(() => {
    if (!isEditDialogOpen) {
      reset();
      setFormData(initialFormData);
    }
  }, [isEditDialogOpen, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    try {
      const updateData: UpdateDriverDto = {
        id: selectedDriver.id,
        ...formData,
      };
      await updateDriver(updateData).unwrap();
      setIsEditDialogOpen(false);
      onSuccess?.();
    } catch {
      // Error handled by RTK Query state
    }
  };

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Driver</DialogTitle>
          <DialogDescription>
            Update the driver's information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {getDriverErrorMessage(error)}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-full_name">Full Name *</Label>
              <Input
                id="edit-full_name"
                value={formData.full_name}
                onChange={handleChange("full_name")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={handleChange("phone")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-home_base">Home Base *</Label>
              <Input
                id="edit-home_base"
                value={formData.home_base}
                onChange={handleChange("home_base")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-vehicle">Vehicle *</Label>
              <Input
                id="edit-vehicle"
                value={formData.vehicle}
                onChange={handleChange("vehicle")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vehicle_type">Vehicle Type *</Label>
              <Select
                value={formData.vehicle_type}
                onValueChange={(value: VehicleType) =>
                  setFormData((prev) => ({ ...prev, vehicle_type: value }))
                }
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
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: DriverStatus) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-license_number">License Number *</Label>
              <Input
                id="edit-license_number"
                value={formData.license_number}
                onChange={handleChange("license_number")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-license_expiry">License Expiry *</Label>
              <Input
                id="edit-license_expiry"
                type="date"
                value={formData.license_expiry}
                onChange={handleChange("license_expiry")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="col-span-2 border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-emergency_name">Name *</Label>
                  <Input
                    id="edit-emergency_name"
                    value={formData.emergency_name}
                    onChange={handleChange("emergency_name")}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-emergency_phone">Phone *</Label>
                  <Input
                    id="edit-emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleChange("emergency_phone")}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-emergency_relationship">
                    Relationship *
                  </Label>
                  <Input
                    id="edit-emergency_relationship"
                    value={formData.emergency_relationship}
                    onChange={handleChange("emergency_relationship")}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={handleChange("notes")}
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
