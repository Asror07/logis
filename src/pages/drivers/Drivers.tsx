import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import DriversAddModal from './DriversAddModal'
import DriversEditModal from './DriversEditModal'
import DriversDetailsModal from './DriversDetailsModal'
import DriversStats from './DriversStats'
import { DriversHeader } from './components/DriversHeader'
import { DriversTable } from './components/DriversTable'
import { useDrivers, getDriverErrorMessage } from './useDrivers'
import type { DriverResponse, DriverStatus, VehicleType } from './type'

export default function Drivers() {
  const { collapsed } = useSidebar()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')

  // Build filter params for API
  const statusParam = statusFilter !== 'all' ? (statusFilter as DriverStatus) : undefined
  const vehicleParam = vehicleFilter !== 'all' ? (vehicleFilter as VehicleType) : undefined

  // RTK Query hook
  const {
    drivers,
    totalCount,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    deleteDriver,
    deleteState,
    refetch,
  } = useDrivers({
    page: currentPage,
    pageSize,
    search: searchQuery || undefined,
    status: statusParam,
    vehicleType: vehicleParam,
  })

  // Modal state
  const [selectedDriver, setSelectedDriver] = useState<DriverResponse | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [driverToDelete, setDriverToDelete] = useState<DriverResponse | null>(null)

  // Handlers
  const handleViewDriver = (driver: DriverResponse) => {
    setSelectedDriver(driver)
    setIsDetailOpen(true)
  }

  const handleEditDriver = (driver: DriverResponse) => {
    setSelectedDriver(driver)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (driver: DriverResponse) => {
    setDriverToDelete(driver)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (driverToDelete) {
      try {
        await deleteDriver(driverToDelete.id)
        setIsDeleteDialogOpen(false)
        setDriverToDelete(null)
      } catch {
        // Error handled by deleteState
      }
    }
  }

  const handleAddSuccess = () => {
    // Reset to first page after adding
    setCurrentPage(1)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setSelectedDriver(null)
  }

  // Reset page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleVehicleChange = (vehicle: string) => {
    setVehicleFilter(vehicle)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn('transition-all duration-300', collapsed ? 'ml-16' : 'ml-64')}>
        <Header />
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <DriversStats drivers={drivers} totalCount={totalCount} />

          {/* Actions Bar */}
          <DriversHeader
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            vehicleFilter={vehicleFilter}
            setVehicleFilter={handleVehicleChange}
            onAddClick={() => setIsAddDialogOpen(true)}
          />

          {/* Error Alert */}
          {isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {errorMessage}
                <Button variant="link" className="ml-2 p-0 h-auto" onClick={() => refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Drivers Table with Pagination */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <DriversTable
                  drivers={drivers}
                  onView={handleViewDriver}
                  onEdit={handleEditDriver}
                  onDelete={handleDeleteClick}
                  isLoading={isFetching}
                  page={currentPage}
                  pageSize={pageSize}
                  total={totalCount}
                  onPageChange={setCurrentPage}
                />
              )}
            </CardContent>
          </Card>

          {/* Modals */}
          <DriversDetailsModal
            isDetailOpen={isDetailOpen}
            setIsDetailOpen={setIsDetailOpen}
            selectedDriver={selectedDriver}
          />

          <DriversAddModal
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSuccess={handleAddSuccess}
          />

          <DriversEditModal
            selectedDriver={selectedDriver}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            onSuccess={handleEditSuccess}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Driver</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <strong>{driverToDelete?.full_name}</strong>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              {deleteState.isError && (
                <Alert variant="destructive">
                  <AlertDescription>{getDriverErrorMessage(deleteState.error)}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteState.isLoading}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={deleteState.isLoading}>
                  {deleteState.isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
