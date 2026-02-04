import { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === 'number' ? 0 : value);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible || typeof value !== 'number') return;

    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isVisible, value]);

  return (
    <Card 
      variant="stat" 
      className={cn(
        "p-6 opacity-0 transform translate-y-4 transition-all duration-500",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">
            {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-muted-foreground font-normal">vs last week</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-button">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
}
