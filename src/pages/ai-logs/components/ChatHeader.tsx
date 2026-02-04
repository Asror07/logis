import { Hand, Bot, Phone, Mail, MessageSquare, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { ChatUser, UserRole } from '../types';

const roleColors: Record<UserRole, string> = {
  driver: 'bg-primary/20 text-primary',
  carrier: 'bg-accent/20 text-accent',
  broker: 'bg-info/20 text-info',
  shipper: 'bg-warning/20 text-warning',
  customer: 'bg-success/20 text-success',
};

interface ChatHeaderProps {
  user: ChatUser;
  isAIEnabled: boolean;
  onToggleAI: () => void;
}

export function ChatHeader({ user, isAIEnabled, onToggleAI }: ChatHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: ChatUser['status']) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'away':
        return 'bg-warning';
      case 'offline':
        return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status: ChatUser['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
    }
  };

  return (
    <div className="h-16 px-4 border-b border-border bg-card flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card',
              getStatusColor(user.status)
            )}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{user.name}</h2>
            <Badge className={cn('text-[10px] px-1.5 py-0', roleColors[user.role])}>
              {user.role}
            </Badge>
            <span className="text-xs text-muted-foreground">• {getStatusText(user.status)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{user.company}</span>
            <span>•</span>
            <span>{user.email}</span>
            <span>•</span>
            <span>{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-1 mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Mail className="h-4 w-4" />
          </Button>
        </div>

        {/* Take Over / Rerun AI Button */}
        {isAIEnabled ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={onToggleAI}
          >
            <Hand className="h-4 w-4 mr-2" />
            Take Over
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={onToggleAI}>
            <Bot className="h-4 w-4 mr-2" />
            Rerun AI
          </Button>
        )}

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Contact Details</DropdownMenuItem>
            <DropdownMenuItem>View Load History</DropdownMenuItem>
            <DropdownMenuItem>Export Conversation</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
