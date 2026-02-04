// ============================================
// TEMPLATE UTILITIES
// ============================================

import {
  TemplateVariable,
  TemplateFormData,
  ValidationResult,
  ValidationError,
  VariableType,
} from '../types';

// ============================================
// VARIABLE EXTRACTION
// ============================================

// Regex to match {{variable_name}} patterns
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

/**
 * Extract all variable names from template content
 */
export function extractVariables(content: string): string[] {
  const matches = content.matchAll(VARIABLE_REGEX);
  const variables = new Set<string>();
  
  for (const match of matches) {
    variables.add(match[1]);
  }
  
  return Array.from(variables);
}

/**
 * Extract variables with smart type detection
 */
export function extractVariablesWithTypes(content: string): TemplateVariable[] {
  const variableNames = extractVariables(content);
  
  return variableNames.map((name) => ({
    name,
    type: inferVariableType(name),
    required: true,
    description: generateDescription(name),
  }));
}

/**
 * Infer variable type from name patterns
 */
export function inferVariableType(name: string): VariableType {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('date') || lowerName.includes('time') || lowerName.includes('eta')) {
    return 'date';
  }
  if (lowerName.includes('amount') || lowerName.includes('price') || lowerName.includes('cost') || lowerName.includes('fee')) {
    return 'currency';
  }
  if (lowerName.includes('link') || lowerName.includes('url') || lowerName.includes('tracking')) {
    return 'link';
  }
  if (lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('tel')) {
    return 'phone';
  }
  if (lowerName.includes('count') || lowerName.includes('number') || lowerName.includes('qty') || lowerName.includes('progress')) {
    return 'number';
  }
  
  return 'text';
}

/**
 * Generate human-readable description from variable name
 */
export function generateDescription(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// ============================================
// CONTENT RENDERING
// ============================================

/**
 * Replace variables in template content with actual values
 */
export function renderTemplate(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(VARIABLE_REGEX, (match, variableName) => {
    return values[variableName] ?? match;
  });
}

/**
 * Render template with formatting based on variable types
 */
export function renderTemplateWithFormatting(
  content: string,
  values: Record<string, string>,
  variables: TemplateVariable[]
): string {
  return content.replace(VARIABLE_REGEX, (match, variableName) => {
    const value = values[variableName];
    if (!value) return match;
    
    const variable = variables.find((v) => v.name === variableName);
    if (!variable) return value;
    
    return formatValue(value, variable.type);
  });
}

/**
 * Format value based on its type
 */
export function formatValue(value: string, type: VariableType): string {
  switch (type) {
    case 'currency':
      const num = parseFloat(value);
      return isNaN(num) ? value : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(num);
    
    case 'date':
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    
    case 'phone':
      return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    
    case 'number':
      const number = parseFloat(value);
      return isNaN(number) ? value : new Intl.NumberFormat('en-US').format(number);
    
    default:
      return value;
  }
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate template form data
 */
export function validateTemplate(data: TemplateFormData): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Name validation
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Template name is required' });
  } else if (data.name.length < 3) {
    errors.push({ field: 'name', message: 'Template name must be at least 3 characters' });
  } else if (data.name.length > 100) {
    errors.push({ field: 'name', message: 'Template name must be less than 100 characters' });
  }
  
  // Content validation
  if (!data.content.trim()) {
    errors.push({ field: 'content', message: 'Template content is required' });
  } else {
    // Channel-specific validation
    if (data.channel === 'sms' && data.content.length > 160) {
      errors.push({ 
        field: 'content', 
        message: `SMS content exceeds 160 characters (${data.content.length}/160)` 
      });
    }
    if (data.channel === 'push' && data.content.length > 256) {
      errors.push({ 
        field: 'content', 
        message: `Push notification exceeds 256 characters (${data.content.length}/256)` 
      });
    }
  }
  
  // Check for invalid variable syntax
  const invalidVars = findInvalidVariables(data.content);
  if (invalidVars.length > 0) {
    errors.push({
      field: 'content',
      message: `Invalid variable syntax: ${invalidVars.join(', ')}`,
    });
  }
  
  // Validate required variables have defaults if marked optional
  for (const variable of data.variables) {
    if (!variable.required && !variable.defaultValue) {
      errors.push({
        field: `variable_${variable.name}`,
        message: `Optional variable "${variable.name}" needs a default value`,
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Find invalid variable patterns in content
 */
export function findInvalidVariables(content: string): string[] {
  const invalidPattern = /\{\{([^}]*[^a-zA-Z0-9_}][^}]*)\}\}/g;
  const matches = content.matchAll(invalidPattern);
  return Array.from(matches).map((m) => m[0]);
}

/**
 * Check if all required variables have values
 */
export function validateVariableValues(
  variables: TemplateVariable[],
  values: Record<string, string>
): ValidationResult {
  const errors: ValidationError[] = [];
  
  for (const variable of variables) {
    if (variable.required && !values[variable.name]?.trim()) {
      errors.push({
        field: variable.name,
        message: `${generateDescription(variable.name)} is required`,
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// CHARACTER LIMITS
// ============================================

export const CHANNEL_LIMITS = {
  sms: 160,
  email: 10000,
  push: 256,
} as const;

/**
 * Get character count info for channel
 */
export function getCharacterInfo(content: string, channel: 'sms' | 'email' | 'push') {
  const limit = CHANNEL_LIMITS[channel];
  const count = content.length;
  const remaining = limit - count;
  const isOverLimit = count > limit;
  const percentage = Math.min((count / limit) * 100, 100);
  
  return {
    count,
    limit,
    remaining,
    isOverLimit,
    percentage,
    segments: channel === 'sms' ? Math.ceil(count / 160) : 1,
  };
}

// ============================================
// PREVIEW HELPERS
// ============================================

/**
 * Default preview values for common variable names
 */
export const DEFAULT_PREVIEW_VALUES: Record<string, string> = {
  vehicle: '2024 Honda Accord',
  origin: 'Dallas, TX',
  destination: 'Phoenix, AZ',
  eta: 'Tomorrow at 2:30 PM',
  tracking_link: 'https://track.example.com/ABC123',
  location: 'Abilene, TX',
  progress: '65',
  time_remaining: '30 minutes',
  load_id: 'LD-45821',
  new_eta: 'Tomorrow at 6:00 PM',
  amount: '1250.00',
  customer_name: 'John Smith',
  driver_name: 'Mike Johnson',
  phone: '5551234567',
  email: 'customer@example.com',
  date: new Date().toISOString(),
};

/**
 * Generate preview values for variables
 */
export function generatePreviewValues(variables: TemplateVariable[]): Record<string, string> {
  const values: Record<string, string> = {};
  
  for (const variable of variables) {
    values[variable.name] = 
      DEFAULT_PREVIEW_VALUES[variable.name] || 
      variable.defaultValue || 
      `[${generateDescription(variable.name)}]`;
  }
  
  return values;
}

// ============================================
// EXPORT UTILITIES
// ============================================

export const templateUtils = {
  extractVariables,
  extractVariablesWithTypes,
  inferVariableType,
  generateDescription,
  renderTemplate,
  renderTemplateWithFormatting,
  formatValue,
  validateTemplate,
  validateVariableValues,
  findInvalidVariables,
  getCharacterInfo,
  generatePreviewValues,
  CHANNEL_LIMITS,
  DEFAULT_PREVIEW_VALUES,
};

export default templateUtils;
