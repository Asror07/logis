// ============================================
// TEMPLATE API - Mock Implementation
// ============================================

import { Template, CreateTemplateRequest } from '../types';
import { mockTemplates } from '../data';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const templateApi = {
  async getAll(): Promise<ApiResponse<Template[]>> {
    await delay(500);
    return { success: true, data: [...mockTemplates] };
  },

  async create(data: CreateTemplateRequest): Promise<ApiResponse<Template>> {
    await delay(300);
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      channel: data.channel,
      content: data.content,
      variables: data.variables.map(v => v.name),
      usageCount: 0,
      lastUsed: 'Never',
      isSystem: false,
    };
    return { success: true, data: newTemplate };
  },

  async update(data: CreateTemplateRequest & { id: string }): Promise<ApiResponse<Template>> {
    await delay(300);
    const updated: Template = {
      id: data.id,
      name: data.name,
      type: data.type,
      channel: data.channel,
      content: data.content,
      variables: data.variables.map(v => v.name),
      usageCount: 0,
      lastUsed: 'Never',
      isSystem: false,
    };
    return { success: true, data: updated };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    return { success: true };
  },

  async duplicate(id: string): Promise<ApiResponse<Template>> {
    await delay(300);
    const original = mockTemplates.find(t => t.id === id);
    if (!original) {
      return { success: false, error: 'Template not found' };
    }
    const duplicated: Template = {
      ...original,
      id: Date.now().toString(),
      name: `${original.name} (Copy)`,
      usageCount: 0,
      lastUsed: 'Never',
      isSystem: false,
    };
    return { success: true, data: duplicated };
  },

  async sendTest(data: { templateId: string; recipient: string; variables: Record<string, string> }): Promise<ApiResponse<void>> {
    await delay(1000);
    return { success: true };
  },
};

export default templateApi;
