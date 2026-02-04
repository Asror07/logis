import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, FileText, Mail } from 'lucide-react';

export function HelpSection() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="font-medium">Need Help?</p>
            <p className="text-sm text-muted-foreground">
              Check our documentation or contact support
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Documentation
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
