import { Card, CardContent } from '@/components/ui/card';
import { Truck, Container, Wrench, AlertTriangle } from 'lucide-react';
import { Truck as TruckType, Trailer } from '../types';

interface AssetsStatsProps {
  trucks: TruckType[];
  trailers: Trailer[];
}

export function AssetsStats({ trucks, trailers }: AssetsStatsProps) {
  const activeTrucks = trucks.filter(t => t.status === 'active').length;
  const maintenanceTrucks = trucks.filter(t => t.status === 'maintenance').length;
  const activeTrailers = trailers.filter(t => t.status === 'active').length;
  const outOfService = [...trucks, ...trailers].filter(a => a.status === 'out-of-service').length;

  const stats = [
    {
      label: 'Active Trucks',
      value: activeTrucks,
      total: trucks.length,
      icon: Truck,
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 to-green-500/5',
    },
    {
      label: 'Active Trailers',
      value: activeTrailers,
      total: trailers.length,
      icon: Container,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-500/5',
    },
    {
      label: 'In Maintenance',
      value: maintenanceTrucks + trailers.filter(t => t.status === 'maintenance').length,
      icon: Wrench,
      color: 'text-orange-400',
      bgGradient: 'from-orange-500/20 to-orange-500/5',
    },
    {
      label: 'Out of Service',
      value: outOfService,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgGradient: 'from-destructive/20 to-destructive/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className={`p-4 bg-gradient-to-br ${stat.bgGradient}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    {stat.total !== undefined && (
                      <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                    )}
                  </div>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
