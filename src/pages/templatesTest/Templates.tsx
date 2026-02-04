// ============================================
// TEMPLATES PAGE - UPDATED WITH CREATE MODAL
// ============================================

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { CreateTemplateModal } from "./components/CreateTemplateModal";
import { TemplateEditor } from "./components/TemplateEditor";
import { TemplateLibrary } from "./components/TemplateLibrary";
import { TemplatesHeader } from "./components/TemplatesHeader";
import { useTemplates } from "./hooks/useTemplates";
import { Template } from "./types";

export default function TemplatesTest() {
  const [activeTab, setActiveTab] = useState("templates");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(
    null,
  );
  const { collapsed } = useSidebar();

  // Use the custom hook for template management
  const {
    filteredTemplates,
    selectedTemplate,
    selectTemplate,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    deleteTemplate,
    duplicateTemplate,
    refreshTemplates,
    isLoading,
    error,
  } = useTemplates({ useMockData: true }); // Set to false for real API

  const handleSelectTemplate = (template: Template) => {
    selectTemplate(template);
    setIsEditing(false);
    setTestResult(null);
  };

  const handleTestSend = () => {
    setTestResult(null);
    setTimeout(() => {
      setTestResult(Math.random() > 0.2 ? "success" : "error");
    }, 1500);
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    refreshTemplates();
    setIsCreateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleDuplicate = async (template: Template) => {
    await duplicateTemplate(template.id);
  };

  const handleDelete = async (template: Template) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      await deleteTemplate(template.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main
        className={cn(
          "transition-all duration-300",
          collapsed ? "pl-16" : "pl-64",
        )}
      >
        <Header />

        <div className="p-6 space-y-6">
          {/* Hero gradient */}
          <div
            className={cn(
              "absolute top-16 right-0 h-64 pointer-events-none overflow-hidden",
              collapsed ? "left-16" : "left-64",
            )}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(0 99% 64% / 0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          <TemplatesHeader onCreateNew={handleCreateNew} />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              {error}
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
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
                onEdit={handleEditTemplate}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTemplate(null);
        }}
        onSuccess={handleCreateSuccess}
        editingTemplate={
          editingTemplate
            ? {
                id: editingTemplate.id,
                name: editingTemplate.name,
                type: editingTemplate.type,
                channel: editingTemplate.channel,
                content: editingTemplate.content,
                variables: editingTemplate.variables.map((name) => ({
                  name,
                  type: "text" as const,
                  required: true,
                })),
                isSystem: editingTemplate.isSystem,
              }
            : undefined
        }
      />
    </div>
  );
}
