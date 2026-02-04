import { useDownloadDriversMutation } from "@/app/features/drivers/drivers.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Search } from "lucide-react";

interface DriversHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  vehicleFilter: string;
  setVehicleFilter: (vehicle: string) => void;
  onAddClick: () => void;
}

export function DriversHeader({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  vehicleFilter,
  setVehicleFilter,
  onAddClick,
}: DriversHeaderProps) {
  const [triggerDownload] = useDownloadDriversMutation();

  const handleDownload = async () => {
    const blob = await triggerDownload().unwrap(); // ✅
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "drivers.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="semi_truck">Semi Truck</SelectItem>
            <SelectItem value="box_truck">Box Truck</SelectItem>
            <SelectItem value="sprinter_van">Sprinter</SelectItem>
            <SelectItem value="flatbed">Flatbed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="gap-2" onClick={onAddClick}>
          <Plus className="h-4 w-4" />
          Add Driver
        </Button>
      </div>
    </div>
  );
}
