import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { UserSidebar } from './ai-logs/components/UserSidebar';
import { ChatContent } from './ai-logs/components/ChatContent';
import { EmptyState } from './ai-logs/components/EmptyState';
import { mockUsers, mockConversations } from './ai-logs/data';
import type { ChatUser } from './ai-logs/types';

export default function AILogs() {
  const { collapsed } = useSidebar();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [aiEnabledUsers, setAiEnabledUsers] = useState<Record<string, boolean>>(() => {
    // Initialize from mock data
    return mockUsers.reduce((acc, user) => {
      acc[user.id] = user.isAIEnabled;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const selectedUser = mockUsers.find((u) => u.id === selectedUserId);
  const selectedMessages = selectedUserId ? mockConversations[selectedUserId] || [] : [];

  const handleToggleAI = () => {
    if (selectedUserId) {
      setAiEnabledUsers((prev) => ({
        ...prev,
        [selectedUserId]: !prev[selectedUserId],
      }));
    }
  };

  // Update users with current AI enabled state
  const usersWithAIState: ChatUser[] = mockUsers.map((user) => ({
    ...user,
    isAIEnabled: aiEnabledUsers[user.id] ?? user.isAIEnabled,
  }));

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <main
        className={cn(
          'flex-1 transition-all duration-300 flex',
          collapsed ? 'pl-16' : 'pl-64'
        )}
      >
        {/* User Sidebar */}
        <UserSidebar
          users={usersWithAIState}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />

        {/* Chat Content or Empty State */}
        {selectedUser ? (
          <ChatContent
            user={{ ...selectedUser, isAIEnabled: aiEnabledUsers[selectedUser.id] ?? selectedUser.isAIEnabled }}
            messages={selectedMessages}
            isAIEnabled={aiEnabledUsers[selectedUser.id] ?? selectedUser.isAIEnabled}
            onToggleAI={handleToggleAI}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
