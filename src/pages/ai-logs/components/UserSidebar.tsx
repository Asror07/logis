import { useState } from 'react';
import { Search, Bot, BotOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { ChatUser, UserRole } from '../types';

const roleColors: Record<UserRole, string> = {
  driver: 'bg-primary/20 text-primary',
  carrier: 'bg-accent/20 text-accent',
  broker: 'bg-info/20 text-info',
  shipper: 'bg-warning/20 text-warning',
  customer: 'bg-success/20 text-success',
};

const roleFilters: { label: string; value: UserRole | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Drivers', value: 'driver' },
  { label: 'Carriers', value: 'carrier' },
  { label: 'Brokers', value: 'broker' },
  { label: 'Shippers', value: 'shipper' },
  { label: 'Customers', value: 'customer' },
];

interface UserSidebarProps {
  users: ChatUser[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function UserSidebar({ users, selectedUserId, onSelectUser }: UserSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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

  return (
    <div className="w-[280px] border-r border-border bg-card flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Role Filters */}
      <div className="px-4 py-2 border-b border-border overflow-x-auto">
        <div className="flex gap-1.5 pb-1">
          {roleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setRoleFilter(filter.value)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  roleFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {filter.label}
              </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={cn(
                'w-full p-3 rounded-lg text-left transition-all mb-1',
                'hover:bg-secondary/50',
                selectedUserId === user.id && 'bg-secondary border border-primary/30'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar with status */}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(user.lastMessageTime), { addSuffix: false })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge className={cn('text-[10px] px-1.5 py-0', roleColors[user.role])}>
                      {user.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">{user.company}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground truncate flex-1 pr-2">
                      {user.lastMessage}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {/* AI Status */}
                      {user.isAIEnabled ? (
                        <Bot className="h-3 w-3 text-success" />
                      ) : (
                        <BotOff className="h-3 w-3 text-destructive" />
                      )}
                      {/* Unread Badge */}
                      {user.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No users found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
