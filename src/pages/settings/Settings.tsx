import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Building, Bell, Palette, Shield, Key, FileText } from 'lucide-react';

import { Settings as SettingsType } from './types';
import { defaultSettings } from './data';
import { SettingsHeader } from './components/SettingsHeader';
import { GeneralTab } from './components/GeneralTab';
import { NotificationsTab } from './components/NotificationsTab';
import { AppearanceTab } from './components/AppearanceTab';
import { SecurityTab } from './components/SecurityTab';
import { ApiTab } from './components/ApiTab';
import { ProjectScopeTab } from './components/ProjectScopeTab';
import { HelpSection } from './components/HelpSection';

export default function Settings() {
  const { collapsed } = useSidebar();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('role') === 'admin';
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const updateSetting = (key: keyof SettingsType, value: SettingsType[keyof SettingsType]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main
        className={cn(
          'transition-all duration-300',
          collapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <Header />

        <div className="p-6 space-y-6">
          {/* Hero gradient */}
          <div
            className={cn(
              'absolute top-16 right-0 h-64 pointer-events-none overflow-hidden',
              collapsed ? 'left-16' : 'left-64'
            )}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(220 70% 50% / 0.3) 0%, transparent 70%)',
              }}
            />
          </div>

          <SettingsHeader />

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="relative">
            <TabsList
              className={`grid w-full ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} lg:w-auto lg:inline-grid`}
            >
              <TabsTrigger value="general" className="gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="scope" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Project Scope</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="general">
              <GeneralTab settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsTab settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceTab settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="api">
              <ApiTab settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="scope">
                <ProjectScopeTab />
              </TabsContent>
            )}
          </Tabs>

          <HelpSection />
        </div>
      </main>
    </div>
  );
}
