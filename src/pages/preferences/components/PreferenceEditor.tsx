import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Building,
  MessageSquare,
  Mail,
  Bell,
  Moon,
  Clock,
  Brain,
  Check,
  X,
  Edit2,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPreference } from '../types';

interface PreferenceEditorProps {
  user: UserPreference | null;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const channelConfig = [
  { key: 'sms', icon: MessageSquare, label: 'SMS' },
  { key: 'email', icon: Mail, label: 'Email' },
  { key: 'push', icon: Bell, label: 'Push' },
] as const;

export function PreferenceEditor({
  user,
  isEditing,
  onToggleEdit
}: PreferenceEditorProps) {
  if (!user) {
    return (
      <Card variant="glow" className="lg:col-span-2">
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select a user to view and edit preferences</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glow" className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Building className="h-3 w-3" />
              <span>{user.company}</span>
            </div>
          </div>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={onToggleEdit}
        >
          {isEditing ? <><Save className="h-4 w-4 mr-1" /> Save</> : <><Edit2 className="h-4 w-4 mr-1" /> Edit</>}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Channel Preferences */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Channel Preferences
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {channelConfig.map((channel) => {
              const Icon = channel.icon;
              const enabled = user.channels[channel.key as keyof typeof user.channels];
              return (
                <div
                  key={channel.key}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    enabled ? "border-primary bg-primary/5" : "border-border bg-secondary/30",
                    isEditing && "cursor-pointer hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={cn("h-5 w-5", enabled ? "text-primary" : "text-muted-foreground")} />
                    {enabled ? (
                      <Check className="h-5 w-5 text-success" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="font-medium">{channel.label}</p>
                  <p className="text-xs text-muted-foreground">{enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Notification Frequency
          </h3>
          <div className="flex gap-3">
            {['all', 'important', 'critical'].map((freq) => (
              <button
                key={freq}
                disabled={!isEditing}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl border transition-all capitalize",
                  user.frequency === freq
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-muted-foreground",
                  isEditing && "hover:border-primary/50"
                )}
              >
                {freq === 'all' && 'All Updates'}
                {freq === 'important' && 'Important Only'}
                {freq === 'critical' && 'Critical Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary" />
            Quiet Hours
          </h3>
          {user.quietHours ? (
            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Do not disturb</span>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="font-medium mt-2">
                {user.quietHours.start} - {user.quietHours.end}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-border bg-secondary/30 text-center text-muted-foreground">
              No quiet hours configured
            </div>
          )}
        </div>

        {/* AI Learning Status */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI-Learned Preferences
          </h3>
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Optimal Channel</p>
                <p className="font-semibold">{user.aiLearned.optimalChannel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Best Time</p>
                <p className="font-semibold">{user.aiLearned.optimalTime}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${user.aiLearned.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{Math.round(user.aiLearned.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}