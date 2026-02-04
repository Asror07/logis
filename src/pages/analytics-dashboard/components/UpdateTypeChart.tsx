import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { UpdateTypeItem } from '../types';

interface UpdateTypeChartProps {
  data: UpdateTypeItem[];
}

export function UpdateTypeChart({ data }: UpdateTypeChartProps) {
  return (
    <Card variant="glow">
      <CardHeader>
        <CardTitle>Update Type Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Volume and engagement by notification type</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis type="number" stroke="hsl(220, 10%, 55%)" fontSize={12} />
              <YAxis type="category" dataKey="type" stroke="hsl(220, 10%, 55%)" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220, 20%, 10%)',
                  border: '1px solid hsl(220, 15%, 18%)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="volume" fill="hsl(0, 99%, 64%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
