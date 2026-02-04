// ============================================
// USE TEMPLATES HOOK
// ============================================

import { useCallback, useEffect, useState } from "react";
import {
  CreateTemplateRequest,
  Template,
  TemplateFormData,
  TemplateVariable,
} from "../types";
import { templateApi } from '../api/templateApi';
import { mockTemplates } from "../data";

interface UseTemplatesOptions {
  initialData?: Template[];
  useMockData?: boolean;
}

interface UseTemplatesReturn {
  // State
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  selectedTemplate: Template | null;

  // Actions
  selectTemplate: (template: Template | null) => void;
  createTemplate: (data: CreateTemplateRequest) => Promise<boolean>;
  updateTemplate: (id: string, data: CreateTemplateRequest) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
  duplicateTemplate: (id: string) => Promise<boolean>;
  refreshTemplates: () => Promise<void>;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  filteredTemplates: Template[];
}

export function useTemplates(
  options: UseTemplatesOptions = {},
): UseTemplatesReturn {
  const { initialData, useMockData = false } = options;

  // State
  const [templates, setTemplates] = useState<Template[]>(
    initialData || (useMockData ? mockTemplates : []),
  );
  const [isLoading, setIsLoading] = useState(!initialData && !useMockData);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch templates on mount
  useEffect(() => {
    if (!initialData && !useMockData) {
      refreshTemplates();
    }
  }, []);

  // Refresh templates from API
  const refreshTemplates = useCallback(async () => {
    if (useMockData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await templateApi.getAll();
      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        setError(response.error || "Failed to fetch templates");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

  // Select template
  const selectTemplate = useCallback((template: Template | null) => {
    setSelectedTemplate(template);
  }, []);

  // Create template
  const createTemplate = useCallback(
    async (data: CreateTemplateRequest): Promise<boolean> => {
      if (useMockData) {
        // Mock create
        const newTemplate: Template = {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          channel: data.channel,
          content: data.content,
          variables: data.variables.map((v) => v.name),
          usageCount: 0,
          lastUsed: "Never",
          isSystem: false,
        };
        setTemplates((prev) => [...prev, newTemplate]);
        return true;
      }

      try {
        const response = await templateApi.create(data);
        if (response.success && response.data) {
          setTemplates((prev) => [...prev, response.data!]);
          return true;
        }
        setError(response.error || "Failed to create template");
        return false;
      } catch (err) {
        setError("Network error occurred");
        return false;
      }
    },
    [useMockData],
  );

  // Update template
  const updateTemplate = useCallback(
    async (id: string, data: CreateTemplateRequest): Promise<boolean> => {
      if (useMockData) {
        // Mock update
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, ...data, variables: data.variables.map((v) => v.name) }
              : t,
          ),
        );
        if (selectedTemplate?.id === id) {
          setSelectedTemplate((prev) =>
            prev
              ? {
                  ...prev,
                  ...data,
                  variables: data.variables.map((v) => v.name),
                }
              : null,
          );
        }
        return true;
      }

      try {
        const response = await templateApi.update({ ...data, id });
        if (response.success && response.data) {
          setTemplates((prev) =>
            prev.map((t) => (t.id === id ? response.data! : t)),
          );
          if (selectedTemplate?.id === id) {
            setSelectedTemplate(response.data);
          }
          return true;
        }
        setError(response.error || "Failed to update template");
        return false;
      } catch (err) {
        setError("Network error occurred");
        return false;
      }
    },
    [useMockData, selectedTemplate],
  );

  // Delete template
  const deleteTemplate = useCallback(
    async (id: string): Promise<boolean> => {
      if (useMockData) {
        // Mock delete
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
        return true;
      }

      try {
        const response = await templateApi.delete(id);
        if (response.success) {
          setTemplates((prev) => prev.filter((t) => t.id !== id));
          if (selectedTemplate?.id === id) {
            setSelectedTemplate(null);
          }
          return true;
        }
        setError(response.error || "Failed to delete template");
        return false;
      } catch (err) {
        setError("Network error occurred");
        return false;
      }
    },
    [useMockData, selectedTemplate],
  );

  // Duplicate template
  const duplicateTemplate = useCallback(
    async (id: string): Promise<boolean> => {
      const original = templates.find((t) => t.id === id);
      if (!original) return false;

      if (useMockData) {
        // Mock duplicate
        const duplicated: Template = {
          ...original,
          id: Date.now().toString(),
          name: `${original.name} (Copy)`,
          usageCount: 0,
          lastUsed: "Never",
          isSystem: false,
        };
        setTemplates((prev) => [...prev, duplicated]);
        return true;
      }

      try {
        const response = await templateApi.duplicate(id);
        if (response.success && response.data) {
          setTemplates((prev) => [...prev, response.data!]);
          return true;
        }
        setError(response.error || "Failed to duplicate template");
        return false;
      } catch (err) {
        setError("Network error occurred");
        return false;
      }
    },
    [useMockData, templates],
  );

  // Filtered templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return {
    templates,
    isLoading,
    error,
    selectedTemplate,
    selectTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    refreshTemplates,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredTemplates,
  };
}

// ============================================
// USE TEMPLATE FORM HOOK
// ============================================

interface UseTemplateFormReturn {
  formData: TemplateFormData;
  updateField: <K extends keyof TemplateFormData>(
    key: K,
    value: TemplateFormData[K],
  ) => void;
  updateVariable: (index: number, updates: Partial<TemplateVariable>) => void;
  resetForm: () => void;
  loadTemplate: (template: Template) => void;
  isValid: boolean;
}

const DEFAULT_FORM_DATA: TemplateFormData = {
  name: "",
  type: "pickup",
  channel: "sms",
  content: "",
  variables: [],
  isSystem: false,
};

export function useTemplateForm(
  initialData?: Partial<TemplateFormData>,
): UseTemplateFormReturn {
  const [formData, setFormData] = useState<TemplateFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });

  const updateField = useCallback(
    <K extends keyof TemplateFormData>(key: K, value: TemplateFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateVariable = useCallback(
    (index: number, updates: Partial<TemplateVariable>) => {
      setFormData((prev) => ({
        ...prev,
        variables: prev.variables.map((v, i) =>
          i === index ? { ...v, ...updates } : v,
        ),
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM_DATA, ...initialData });
  }, [initialData]);

  const loadTemplate = useCallback((template: Template) => {
    setFormData({
      name: template.name,
      type: template.type,
      channel: template.channel,
      content: template.content,
      variables: template.variables.map((name) => ({
        name,
        type: "text" as const,
        required: true,
      })),
      isSystem: template.isSystem,
    });
  }, []);

  const isValid =
    formData.name.trim().length >= 3 && formData.content.trim().length > 0;

  return {
    formData,
    updateField,
    updateVariable,
    resetForm,
    loadTemplate,
    isValid,
  };
}

export default useTemplates;
