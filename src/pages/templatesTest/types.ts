// ============================================
// TEMPLATE TYPES & INTERFACES
// ============================================

export type TemplateType = 'pickup' | 'transit' | 'delivery' | 'exception' | 'payment';
export type TemplateChannel = 'sms' | 'email' | 'push';

// Variable types for rich formatting
export type VariableType = 'text' | 'date' | 'currency' | 'link' | 'number' | 'phone';

export interface TemplateVariable {
  name: string;
  type: VariableType;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  channel: TemplateChannel;
  content: string;
  variables: string[];
  usageCount: number;
  lastUsed: string;
  isSystem: boolean;
}

// Extended template for creation/editing
export interface TemplateFormData {
  name: string;
  type: TemplateType;
  channel: TemplateChannel;
  content: string;
  variables: TemplateVariable[];
  isSystem: boolean;
}

// API Request/Response types
export interface CreateTemplateRequest {
  name: string;
  type: TemplateType;
  channel: TemplateChannel;
  content: string;
  variables: TemplateVariable[];
}

export interface UpdateTemplateRequest extends CreateTemplateRequest {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SendTestRequest {
  templateId: string;
  recipient: string;
  variables: Record<string, string>;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
