import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PieDataItem } from '../types';

interface ChannelDistributionChartProps {
  data: PieDataItem[];
}

export function ChannelDistributionChart({ data }: ChannelDistributionChartProps) {
  return (
    <Card variant="glow">
      <CardHeader>
        <CardTitle>Channel Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Messages by channel</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name} ({item.value}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
