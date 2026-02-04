import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, CreditCard, ExternalLink } from 'lucide-react';
import { SettingsTabProps } from '../types';

export function GeneralTab({ settings, updateSetting }: SettingsTabProps) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => updateSetting('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing & Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">
                Enterprise Plan - Unlimited messages
              </p>
            </div>
            <Badge variant="default" className="bg-gradient-primary">
              Active
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">12,458</p>
              <p className="text-xs text-muted-foreground">Messages This Month</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">$249</p>
              <p className="text-xs text-muted-foreground">Monthly Cost</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">Jan 15</p>
              <p className="text-xs text-muted-foreground">Next Billing</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
