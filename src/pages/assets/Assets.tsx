import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Truck, Container } from 'lucide-react';

import { Truck as TruckType, Trailer, TruckFormData, TrailerFormData } from './types';
import { mockTrucks, mockTrailers } from './data';
import { AssetsStats } from './components/AssetsStats';
import { AssetsHeader } from './components/AssetsHeader';
import { TrucksTable } from './components/TrucksTable';
import { TrailersTable } from './components/TrailersTable';
import { TruckAddModal } from './components/TruckAddModal';
import { TruckEditModal } from './components/TruckEditModal';
import { TruckDetailsModal } from './components/TruckDetailsModal';
import { TrailerAddModal } from './components/TrailerAddModal';
import { TrailerEditModal } from './components/TrailerEditModal';
import { TrailerDetailsModal } from './components/TrailerDetailsModal';

export default function Assets() {
  const { collapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState<'trucks' | 'trailers'>('trucks');

  // Trucks state
  const [trucks, setTrucks] = useState<TruckType[]>(mockTrucks);
  const [truckSearchQuery, setTruckSearchQuery] = useState('');
  const [truckStatusFilter, setTruckStatusFilter] = useState('all');
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const [truckAddModalOpen, setTruckAddModalOpen] = useState(false);
  const [truckEditModalOpen, setTruckEditModalOpen] = useState(false);
  const [truckDetailsModalOpen, setTruckDetailsModalOpen] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState<TruckType | null>(null);

  // Trailers state
  const [trailers, setTrailers] = useState<Trailer[]>(mockTrailers);
  const [trailerSearchQuery, setTrailerSearchQuery] = useState('');
  const [trailerStatusFilter, setTrailerStatusFilter] = useState('all');
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [trailerAddModalOpen, setTrailerAddModalOpen] = useState(false);
  const [trailerEditModalOpen, setTrailerEditModalOpen] = useState(false);
  const [trailerDetailsModalOpen, setTrailerDetailsModalOpen] = useState(false);
  const [trailerToDelete, setTrailerToDelete] = useState<Trailer | null>(null);

  // Filter trucks
  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch =
      truck.unitNumber.toLowerCase().includes(truckSearchQuery.toLowerCase()) ||
      truck.licensePlate.toLowerCase().includes(truckSearchQuery.toLowerCase()) ||
      truck.make.toLowerCase().includes(truckSearchQuery.toLowerCase()) ||
      truck.model.toLowerCase().includes(truckSearchQuery.toLowerCase()) ||
      (truck.assignedDriverName?.toLowerCase().includes(truckSearchQuery.toLowerCase()));
    const matchesStatus = truckStatusFilter === 'all' || truck.status === truckStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter trailers
  const filteredTrailers = trailers.filter(trailer => {
    const matchesSearch =
      trailer.trailerNumber.toLowerCase().includes(trailerSearchQuery.toLowerCase()) ||
      (trailer.licensePlate?.toLowerCase().includes(trailerSearchQuery.toLowerCase())) ||
      trailer.type.toLowerCase().includes(trailerSearchQuery.toLowerCase());
    const matchesStatus = trailerStatusFilter === 'all' || trailer.status === trailerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Truck handlers
  const handleAddTruck = (data: TruckFormData) => {
    const newTruck: TruckType = {
      ...data,
      id: `TRK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrucks(prev => [...prev, newTruck]);
    toast.success('Truck added successfully');
  };

  const handleEditTruck = (id: string, data: TruckFormData) => {
    setTrucks(prev => prev.map(truck =>
      truck.id === id ? { ...truck, ...data, updatedAt: new Date().toISOString() } : truck
    ));
    toast.success('Truck updated successfully');
  };

  const handleDeleteTruck = () => {
    if (truckToDelete) {
      setTrucks(prev => prev.filter(truck => truck.id !== truckToDelete.id));
      toast.success('Truck deleted successfully');
      setTruckToDelete(null);
    }
  };

  // Trailer handlers
  const handleAddTrailer = (data: TrailerFormData) => {
    const newTrailer: Trailer = {
      ...data,
      id: `TRL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrailers(prev => [...prev, newTrailer]);
    toast.success('Trailer added successfully');
  };

  const handleEditTrailer = (id: string, data: TrailerFormData) => {
    setTrailers(prev => prev.map(trailer =>
      trailer.id === id ? { ...trailer, ...data, updatedAt: new Date().toISOString() } : trailer
    ));
    toast.success('Trailer updated successfully');
  };

  const handleDeleteTrailer = () => {
    if (trailerToDelete) {
      setTrailers(prev => prev.filter(trailer => trailer.id !== trailerToDelete.id));
      toast.success('Trailer deleted successfully');
      setTrailerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab="assets" />
      <main className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-64")}>
        <Header />
        <div className="p-6 space-y-6">
          {/* Hero gradient */}
          <div className={cn("absolute top-16 right-0 h-64 pointer-events-none overflow-hidden", collapsed ? "left-16" : "left-64")}>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(0 99% 64% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          {/* Page Header */}
          <div className="relative">
            <h1 className="text-3xl font-bold">Asset Management</h1>
            <p className="text-muted-foreground mt-1">Manage your trucks and trailers</p>
          </div>

          {/* Stats */}
          <AssetsStats trucks={trucks} trailers={trailers} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'trucks' | 'trailers')}>
            <TabsList className="mb-4">
              <TabsTrigger value="trucks" className="gap-2">
                <Truck className="h-4 w-4" />
                Trucks
              </TabsTrigger>
              <TabsTrigger value="trailers" className="gap-2">
                <Container className="h-4 w-4" />
                Trailers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trucks" className="space-y-4">
              <AssetsHeader
                searchQuery={truckSearchQuery}
                onSearchChange={setTruckSearchQuery}
                statusFilter={truckStatusFilter}
                onStatusFilterChange={setTruckStatusFilter}
                onAddNew={() => setTruckAddModalOpen(true)}
                assetType="trucks"
              />
              <TrucksTable
                trucks={filteredTrucks}
                onView={(truck) => { setSelectedTruck(truck); setTruckDetailsModalOpen(true); }}
                onEdit={(truck) => { setSelectedTruck(truck); setTruckEditModalOpen(true); }}
                onDelete={(truck) => setTruckToDelete(truck)}
              />
            </TabsContent>

            <TabsContent value="trailers" className="space-y-4">
              <AssetsHeader
                searchQuery={trailerSearchQuery}
                onSearchChange={setTrailerSearchQuery}
                statusFilter={trailerStatusFilter}
                onStatusFilterChange={setTrailerStatusFilter}
                onAddNew={() => setTrailerAddModalOpen(true)}
                assetType="trailers"
              />
              <TrailersTable
                trailers={filteredTrailers}
                onView={(trailer) => { setSelectedTrailer(trailer); setTrailerDetailsModalOpen(true); }}
                onEdit={(trailer) => { setSelectedTrailer(trailer); setTrailerEditModalOpen(true); }}
                onDelete={(trailer) => setTrailerToDelete(trailer)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Truck Modals */}
      <TruckAddModal open={truckAddModalOpen} onOpenChange={setTruckAddModalOpen} onSubmit={handleAddTruck} />
      <TruckEditModal truck={selectedTruck} open={truckEditModalOpen} onOpenChange={setTruckEditModalOpen} onSubmit={handleEditTruck} />
      <TruckDetailsModal
        truck={selectedTruck}
        open={truckDetailsModalOpen}
        onOpenChange={setTruckDetailsModalOpen}
        onEdit={(truck) => { setTruckDetailsModalOpen(false); setSelectedTruck(truck); setTruckEditModalOpen(true); }}
      />

      {/* Trailer Modals */}
      <TrailerAddModal open={trailerAddModalOpen} onOpenChange={setTrailerAddModalOpen} onSubmit={handleAddTrailer} />
      <TrailerEditModal trailer={selectedTrailer} open={trailerEditModalOpen} onOpenChange={setTrailerEditModalOpen} onSubmit={handleEditTrailer} />
      <TrailerDetailsModal
        trailer={selectedTrailer}
        open={trailerDetailsModalOpen}
        onOpenChange={setTrailerDetailsModalOpen}
        onEdit={(trailer) => { setTrailerDetailsModalOpen(false); setSelectedTrailer(trailer); setTrailerEditModalOpen(true); }}
      />

      {/* Delete Truck Confirmation */}
      <AlertDialog open={!!truckToDelete} onOpenChange={() => setTruckToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Truck</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete truck {truckToDelete?.unitNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTruck} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Trailer Confirmation */}
      <AlertDialog open={!!trailerToDelete} onOpenChange={() => setTrailerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trailer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete trailer {trailerToDelete?.trailerNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTrailer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
