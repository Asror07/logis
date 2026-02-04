import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div className="relative flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <SettingsIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>
      </div>
      <Button variant="gradient">
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
}
