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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { SettingsTabProps } from '../types';

export function SecurityTab({ settings, updateSetting }: SettingsTabProps) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>Manage your security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <div className="flex items-center gap-3">
              {settings.twoFactorEnabled ? (
                <Badge variant="default" className="bg-success">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">Disabled</Badge>
              )}
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  updateSetting('twoFactorEnabled', checked)
                }
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
              className="max-w-[200px]"
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">IP Whitelist (comma separated)</Label>
            <Input
              id="ipWhitelist"
              placeholder="192.168.1.1, 10.0.0.1"
              value={settings.ipWhitelist}
              onChange={(e) => updateSetting('ipWhitelist', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to allow all IPs
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
