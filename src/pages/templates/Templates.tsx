import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

import { Template } from './types';
import { mockTemplates } from './data';
import { TemplatesHeader } from './components/TemplatesHeader';
import { TemplateLibrary } from './components/TemplateLibrary';
import { TemplateEditor } from './components/TemplateEditor';

export default function Templates() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const { collapsed } = useSidebar();

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(false);
    setTestResult(null);
  };

  const handleTestSend = () => {
    setTestResult(null);
    setTimeout(() => {
      setTestResult(Math.random() > 0.2 ? 'success' : 'error');
    }, 1500);
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
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(0 99% 64% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          <TemplatesHeader onCreateNew={() => {
            setSelectedTemplate(null);
            setIsEditing(true);
          }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TemplateLibrary
              templates={filteredTemplates}
              selectedTemplate={selectedTemplate}
              searchQuery={searchQuery}
              typeFilter={typeFilter}
              onSearchChange={setSearchQuery}
              onTypeFilterChange={setTypeFilter}
              onSelectTemplate={handleSelectTemplate}
            />

            <TemplateEditor
              template={selectedTemplate}
              isEditing={isEditing}
              testResult={testResult}
              onToggleEdit={() => setIsEditing(!isEditing)}
              onTestSend={handleTestSend}
            />
          </div>
        </div>
      </main>
    </div>
  );
}