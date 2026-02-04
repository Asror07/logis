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
import { Key, RefreshCw, Database } from 'lucide-react';
import { SettingsTabProps } from '../types';
import { integrations } from '../data';

export function ApiTab({ settings, updateSetting }: SettingsTabProps) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Manage your API keys and integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                value={settings.apiKey}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep this key secret. Regenerating will invalidate the old key.
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={settings.webhookUrl}
              onChange={(e) => updateSetting('webhookUrl', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
            <Input
              id="rateLimit"
              type="number"
              value={settings.rateLimitPerMinute}
              onChange={(e) => updateSetting('rateLimitPerMinute', e.target.value)}
              className="max-w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connected Integrations
          </CardTitle>
          <CardDescription>
            Third-party services connected to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <integration.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{integration.name}</span>
              </div>
              <Badge
                variant={
                  integration.status === 'Connected' ? 'default' : 'secondary'
                }
              >
                {integration.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
