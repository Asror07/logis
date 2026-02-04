import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send, ChevronRight } from 'lucide-react';
import { CustomTable, Column } from '@/components/ui/table/index';
import { RecentReport } from '../types';

interface RecentReportsProps {
  reports: RecentReport[];
}

export function RecentReports({ reports }: RecentReportsProps) {
  const columns: Column<RecentReport>[] = [
    {
      key: 'name',
      header: 'Report Name',
      render: (report) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">{report.name}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Generated',
      className: 'text-muted-foreground',
      render: (report) => report.date,
    },
    {
      key: 'format',
      header: 'Format',
      render: (report) => <Badge variant="secondary">{report.format}</Badge>,
    },
    {
      key: 'size',
      header: 'Size',
      className: 'text-muted-foreground',
      render: (report) => report.size,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: () => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card variant="glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Reports</CardTitle>
          <p className="text-sm text-muted-foreground">Previously generated reports</p>
        </div>
        <Button variant="ghost" size="sm">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <CustomTable
          data={reports}
          columns={columns}
          getRowKey={(report) => report.name}
        />
      </CardContent>
    </Card>
  );
}
