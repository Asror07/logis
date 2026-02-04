import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/ui/table/DataTable";
import type { Column } from "@/components/ui/table/types";
import { cn } from "@/lib/utils";
import { Edit, Eye, Trash2 } from "lucide-react";
import type { DriverResponse, DriverStatus, VehicleType } from "../type";

interface DriversTableProps {
  drivers: DriverResponse[];
  onView: (driver: DriverResponse) => void;
  onEdit: (driver: DriverResponse) => void;
  onDelete: (driver: DriverResponse) => void;
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
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

export function DriversTable({
  drivers,
  onView,
  onEdit,
  onDelete,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
}: DriversTableProps) {
  const columns: Column<DriverResponse>[] = [
    {
      key: "driver",
      header: "Driver",
      render: (driver) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/20 text-primary">
              {driver.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{driver.full_name}</p>
            <p className="text-xs text-muted-foreground">{driver.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (driver) => driver.phone,
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (driver) => (
        <div>
          <p className="text-sm">{vehicleTypeLabels[driver.vehicle_type]}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
            {driver.vehicle}
          </p>
        </div>
      ),
    },
    {
      key: "home_base",
      header: "Home Base",
      render: (driver) => <span className="text-sm">{driver.home_base}</span>,
    },
    {
      key: "license",
      header: "License",
      render: (driver) => (
        <div>
          <p className="text-sm">{driver.license_number}</p>
          <p className="text-xs text-muted-foreground">
            Exp: {new Date(driver.license_expiry).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (driver) => (
        <Badge
          variant="outline"
          className={cn("border", statusConfig[driver.status]?.color)}
        >
          {statusConfig[driver.status]?.label || driver.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (driver) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onView(driver)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(driver)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(driver)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      className={cn("relative", isLoading && "opacity-50 pointer-events-none")}
    >
      <CustomTable
        data={drivers}
        columns={columns}
        onRowClick={onView}
        getRowKey={(driver) => driver.id}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        emptyMessage="No drivers found"
      />
    </div>
  );
}
