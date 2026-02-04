// ============================================
// TEMPLATES MODULE - INDEX
// ============================================

// Types
export * from "./types";

// Data
export * from "./data";

// API
// export { templateApi } from "./api/templateApi";

// Utils
export {
  CHANNEL_LIMITS,
  DEFAULT_PREVIEW_VALUES,
  extractVariables,
  extractVariablesWithTypes,
  findInvalidVariables,
  formatValue,
  generateDescription,
  generatePreviewValues,
  getCharacterInfo,
  inferVariableType,
  renderTemplate,
  renderTemplateWithFormatting,
  templateUtils,
  validateTemplate,
  validateVariableValues,
} from "./utils/templateUtils";

// Hooks
// export { useTemplateForm, useTemplates } from "./hooks/useTemplates";

// Components
export { CreateTemplateModal } from "./components/CreateTemplateModal";
export { TemplateEditor } from "./components/TemplateEditor";
export { TemplateLibrary } from "./components/TemplateLibrary";
export { TemplatesHeader } from "./components/TemplatesHeader";

// Page
export { default as Templates } from "./Templates";
