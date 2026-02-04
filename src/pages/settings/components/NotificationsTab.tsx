import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Smartphone, FileText } from 'lucide-react';
import { SettingsTabProps } from '../types';

export function NotificationsTab({ settings, updateSetting }: SettingsTabProps) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSetting('emailNotifications', checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Browser push notifications
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                updateSetting('pushNotifications', checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Critical alerts via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                updateSetting('smsNotifications', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Digests
          </CardTitle>
          <CardDescription>
            Automated reports and summary emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Digest</p>
              <p className="text-sm text-muted-foreground">
                Summary of daily activities at 6:00 PM
              </p>
            </div>
            <Switch
              checked={settings.dailyDigest}
              onCheckedChange={(checked) => updateSetting('dailyDigest', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Performance Report</p>
              <p className="text-sm text-muted-foreground">
                Sent every Monday at 9:00 AM
              </p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => updateSetting('weeklyReport', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Exception Alerts</p>
              <p className="text-sm text-muted-foreground">
                Immediate alerts for critical exceptions
              </p>
            </div>
            <Switch
              checked={settings.exceptionAlerts}
              onCheckedChange={(checked) =>
                updateSetting('exceptionAlerts', checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
