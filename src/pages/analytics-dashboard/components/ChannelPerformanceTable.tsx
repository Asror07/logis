import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { CustomTable, Column } from '@/components/ui/table/index';
import { ChannelPerformanceItem } from '../types';

interface ChannelPerformanceTableProps {
  data: ChannelPerformanceItem[];
}

const channelIcons: Record<string, React.ReactNode> = {
  SMS: <MessageSquare className="h-5 w-5 text-primary" />,
  Email: <Mail className="h-5 w-5 text-accent" />,
  Call: <Phone className="h-5 w-5 text-warning" />,
};

export function ChannelPerformanceTable({ data }: ChannelPerformanceTableProps) {
  const columns: Column<ChannelPerformanceItem>[] = [
    {
      key: 'channel',
      header: 'Channel',
      render: (row) => (
        <div className="flex items-center gap-3">
          {channelIcons[row.channel]}
          <span className="font-medium">{row.channel}</span>
        </div>
      ),
    },
    {
      key: 'delivered',
      header: 'Delivery Rate',
      render: (row) => <Badge variant="success">{row.delivered}%</Badge>,
    },
    {
      key: 'opened',
      header: 'Open Rate',
      render: (row) => `${row.opened}%`,
    },
    {
      key: 'clicked',
      header: 'Click Rate',
      render: (row) => `${row.clicked}%`,
    },
    {
      key: 'satisfaction',
      header: 'Satisfaction',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-warning">★</span>
          <span>{row.satisfaction}</span>
        </div>
      ),
    },
  ];

  return (
    <Card variant="glow">
      <CardHeader>
        <CardTitle>Channel Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Delivery and engagement rates by channel</p>
      </CardHeader>
      <CardContent>
        <CustomTable
          data={data}
          columns={columns}
          getRowKey={(row) => row.channel}
        />
      </CardContent>
    </Card>
  );
}
