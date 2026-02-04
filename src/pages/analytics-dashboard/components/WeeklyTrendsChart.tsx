import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { WeeklyDataItem } from '../types';

interface WeeklyTrendsChartProps {
  data: WeeklyDataItem[];
}

export function WeeklyTrendsChart({ data }: WeeklyTrendsChartProps) {
  return (
    <Card variant="glow" className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Notifications sent and engagement rate</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradientNotif" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 99%, 64%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 99%, 64%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="week" stroke="hsl(220, 10%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220, 20%, 10%)',
                  border: '1px solid hsl(220, 15%, 18%)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="notifications"
                stroke="hsl(0, 99%, 64%)"
                fill="url(#gradientNotif)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
