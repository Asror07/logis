import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDriver } from "@/pages/drivers/useDrivers";
import { Calendar, Mail, MapPin, Phone, Shield, Truck } from "lucide-react";
import type { DriverResponse, DriverStatus, VehicleType } from "./type";

interface DriverDetailProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedDriver: DriverResponse | null;
}

const statusConfig: Record<DriverStatus, { label: string; color: string }> = {
  active: {
    label: "Active",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  inactive: {
    label: "Inactive",
    color: "bg-muted text-muted-foreground border-border",
  },
  on_leave: {
    label: "On Leave",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  suspended: {
    label: "Suspended",
    color: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

const vehicleTypeLabels: Record<VehicleType, string> = {
  semi_truck: "Semi Truck",
  box_truck: "Box Truck",
  sprinter: "Sprinter Van",
  flatbed: "Flatbed",
};

export default function DriversDetailsModal({
  isDetailOpen,
  setIsDetailOpen,
  selectedDriver,
}: DriverDetailProps) {
  const { driver, isLoading, isError, error } = useDriver(selectedDriver?.id);
  if (!selectedDriver) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {driver?.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-xl">{driver?.full_name}</SheetTitle>
              <Badge
                variant="outline"
                className={cn(
                  "border mt-1",
                  statusConfig[driver?.status]?.color,
                )}
              >
                {statusConfig[driver?.status]?.label || driver?.status}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{driver?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{driver?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Home Base</p>
                  <p className="text-sm">{driver?.home_base}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Vehicle Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Vehicle</p>
                  <p>{driver?.vehicle}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>{vehicleTypeLabels[driver?.vehicle_type]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License Number</p>
                  <p>{driver?.license_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License Expiry</p>
                  <p>{formatDate(driver?.license_expiry)}</p>
                </div>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold">Emergency Contact</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p>{driver?.emergency_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p>{driver?.emergency_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Relationship</p>
                  <p>{driver?.emergency_relationship}</p>
                </div>
              </div>
            </Card>

            {/* Timestamps */}
            {(selectedDriver.created_at || selectedDriver.updated_at) && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                {selectedDriver.created_at && (
                  <span>Created: {formatDate(selectedDriver.created_at)}</span>
                )}
                {selectedDriver.updated_at && (
                  <span>Updated: {formatDate(selectedDriver.updated_at)}</span>
                )}
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Driver ID: {driver?.id}
                </span>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {driver?.notes || "No notes available."}
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
