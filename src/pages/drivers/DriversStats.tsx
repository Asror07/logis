import { Card } from '@/components/ui/card'
import { TrendingUp, UserCheck, Users } from 'lucide-react'
import type { DriverResponse } from './type'

interface Props {
  drivers: DriverResponse[]
  totalCount?: number
}

export default function DriversStats({ drivers, totalCount }: Props) {
  const total = totalCount ?? drivers.length
  const activeDrivers = drivers.filter((d) => d.status === 'active').length
  const onLeaveDrivers = drivers.filter((d) => d.status === 'on_leave').length
  const inactiveDrivers = drivers.filter((d) => d.status === 'inactive' || d.status === 'suspended').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="stat" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Drivers</p>
            <p className="text-3xl font-bold mt-1">{total}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-400">{activeDrivers} active</span>
              {onLeaveDrivers > 0 && <span className="text-amber-400"> / {onLeaveDrivers} on leave</span>}
            </p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
            <Users className="h-7 w-7 text-primary" />
          </div>
        </div>
      </Card>

      <Card variant="stat" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Drivers</p>
            <p className="text-3xl font-bold mt-1">{activeDrivers}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">
                {total > 0 ? ((activeDrivers / total) * 100).toFixed(0) : 0}% of total
              </span>
            </div>
          </div>
          <div className="h-14 w-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <UserCheck className="h-7 w-7 text-emerald-400" />
          </div>
        </div>
      </Card>

      <Card variant="stat" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">On Leave / Inactive</p>
            <p className="text-3xl font-bold mt-1">{onLeaveDrivers + inactiveDrivers}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-amber-400">{onLeaveDrivers} on leave</span>
              {inactiveDrivers > 0 && <span> / {inactiveDrivers} inactive</span>}
            </p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Users className="h-7 w-7 text-amber-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
