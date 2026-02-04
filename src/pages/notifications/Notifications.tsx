import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';

import { Notification } from './types';
import { mockNotifications } from './data';
import { NotificationsHeader } from './components/NotificationsHeader';
import { NotificationStats } from './components/NotificationStats';
import { NotificationList } from './components/NotificationList';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { collapsed } = useSidebar();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <NotificationsHeader
            unreadCount={unreadCount}
            totalCount={notifications.length}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAll}
          />

          <NotificationStats notifications={notifications} />

          {/* Tabs and Filters */}
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="all" onClick={() => setFilter('all')}>
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" onClick={() => setFilter('unread')}>
                  Unread ({unreadCount})
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              <NotificationList
                notifications={filteredNotifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </TabsContent>
            <TabsContent value="unread" className="mt-0">
              <NotificationList
                notifications={filteredNotifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
