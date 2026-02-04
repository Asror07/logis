import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPreference } from '../types';
import { roleColors, roleFilterOptions } from '../data';

interface UserListProps {
  users: UserPreference[];
  selectedUser: UserPreference | null;
  searchQuery: string;
  roleFilter: string;
  onSearchChange: (query: string) => void;
  onRoleFilterChange: (role: string) => void;
  onSelectUser: (user: UserPreference) => void;
}

export function UserList({
  users,
  selectedUser,
  searchQuery,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onSelectUser
}: UserListProps) {
  return (
    <Card variant="glow" className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {roleFilterOptions.map((role) => (
            <button
              key={role}
              onClick={() => onRoleFilterChange(role)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all capitalize",
                roleFilter === role
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[600px] overflow-y-auto">
        {users.map((user, index) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={cn(
              "w-full p-4 border-b border-border/50 text-left hover:bg-secondary/30 transition-all animate-fade-in",
              selectedUser?.id === user.id && "bg-primary/10 border-l-4 border-l-primary"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", roleColors[user.role])}>
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{user.company}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}