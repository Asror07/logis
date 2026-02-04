import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

import { UserPreference } from './types';
import { mockUsers } from './data';
import { PreferencesHeader } from './components/PreferencesHeader';
import { UserList } from './components/UserList';
import { PreferenceEditor } from './components/PreferenceEditor';

export default function Preferences() {
  const [activeTab, setActiveTab] = useState('preferences');
  const [selectedUser, setSelectedUser] = useState<UserPreference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const { collapsed } = useSidebar();

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (user: UserPreference) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-64")}>
        <Header />

        <div className="p-6 space-y-6">
          {/* Hero gradient */}
          <div className={cn("absolute top-16 right-0 h-64 pointer-events-none overflow-hidden", collapsed ? "left-16" : "left-64")}>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(35 95% 55% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          <PreferencesHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserList
              users={filteredUsers}
              selectedUser={selectedUser}
              searchQuery={searchQuery}
              roleFilter={roleFilter}
              onSearchChange={setSearchQuery}
              onRoleFilterChange={setRoleFilter}
              onSelectUser={handleSelectUser}
            />

            <PreferenceEditor
              user={selectedUser}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
