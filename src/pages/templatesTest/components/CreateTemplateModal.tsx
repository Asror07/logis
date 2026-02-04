// ============================================
// CREATE TEMPLATE MODAL COMPONENT
// ============================================

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronDown,
  Code,
  Eye,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// import { templateApi } from "../api/templateApi";
import {
  TemplateChannel,
  TemplateFormData,
  TemplateType,
  TemplateVariable,
  ValidationError,
  VariableType,
} from "../types";
import {
  extractVariablesWithTypes,
  generateDescription,
  generatePreviewValues,
  getCharacterInfo,
  renderTemplateWithFormatting,
} from "../utils/templateUtils";

// ============================================
// TYPES
// ============================================

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTemplate?: TemplateFormData & { id: string };
}

type Step = "basics" | "content" | "variables" | "preview";

// ============================================
// CONSTANTS
// ============================================

const TEMPLATE_TYPES: { value: TemplateType; label: string; color: string }[] =
  [
    {
      value: "pickup",
      label: "Pickup",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      value: "transit",
      label: "Transit",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    {
      value: "delivery",
      label: "Delivery",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    {
      value: "exception",
      label: "Exception",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    {
      value: "payment",
      label: "Payment",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
  ];

const CHANNELS: {
  value: TemplateChannel;
  label: string;
  icon: typeof MessageSquare;
  limit: number;
}[] = [
  { value: "sms", label: "SMS", icon: MessageSquare, limit: 160 },
  { value: "email", label: "Email", icon: Mail, limit: 10000 },
  { value: "push", label: "Push", icon: Bell, limit: 256 },
];

const VARIABLE_TYPES: { value: VariableType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "date", label: "Date/Time" },
  { value: "currency", label: "Currency" },
  { value: "link", label: "Link/URL" },
  { value: "number", label: "Number" },
  { value: "phone", label: "Phone" },
];

const STEPS: { id: Step; label: string; number: number }[] = [
  { id: "basics", label: "Basics", number: 1 },
  { id: "content", label: "Content", number: 2 },
  { id: "variables", label: "Variables", number: 3 },
  { id: "preview", label: "Preview", number: 4 },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function CreateTemplateModal({
  isOpen,
  onClose,
  onSuccess,
  editingTemplate,
}: CreateTemplateModalProps) {
  // Form state
  const [currentStep, setCurrentStep] = useState<Step>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    type: "pickup",
    channel: "sms",
    content: "",
    variables: [],
    isSystem: false,
  });

  // Preview values for testing
  const [previewValues, setPreviewValues] = useState<Record<string, string>>(
    {},
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editingTemplate) {
        setFormData({
          name: editingTemplate.name,
          type: editingTemplate.type,
          channel: editingTemplate.channel,
          content: editingTemplate.content,
          variables: editingTemplate.variables,
          isSystem: editingTemplate.isSystem,
        });
      } else {
        setFormData({
          name: "",
          type: "pickup",
          channel: "sms",
          content: "",
          variables: [],
          isSystem: false,
        });
      }
      setCurrentStep("basics");
      setErrors([]);
      setSubmitError(null);
    }
  }, [isOpen, editingTemplate]);

  // Auto-extract variables when content changes
  useEffect(() => {
    const extracted = extractVariablesWithTypes(formData.content);

    // Merge with existing variables to preserve user customizations
    const mergedVariables = extracted.map((newVar) => {
      const existing = formData.variables.find((v) => v.name === newVar.name);
      return existing || newVar;
    });

    setFormData((prev) => ({ ...prev, variables: mergedVariables }));
  }, [formData.content]);

  // Update preview values when variables change
  useEffect(() => {
    setPreviewValues(generatePreviewValues(formData.variables));
  }, [formData.variables]);

  // Handlers
  const updateFormData = useCallback(
    <K extends keyof TemplateFormData>(key: K, value: TemplateFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => prev.filter((e) => e.field !== key));
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

  const insertVariable = useCallback(
    (variableName: string) => {
      const insertion = `{{${variableName}}}`;
      updateFormData("content", formData.content + insertion);
    },
    [formData.content, updateFormData],
  );

  const getFieldError = useCallback(
    (field: string) => {
      return errors.find((e) => e.field === field)?.message;
    },
    [errors],
  );

  const canProceed = useCallback(
    (step: Step): boolean => {
      switch (step) {
        case "basics":
          return formData.name.trim().length >= 3;
        case "content":
          return formData.content.trim().length > 0;
        case "variables":
          return true;
        case "preview":
          return true;
        default:
          return false;
      }
    },
    [formData],
  );

  const handleNext = useCallback(() => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  }, [currentStep]);

  // const handleSubmit = useCallback(async () => {
  //   // Validate
  //   const validation = validateTemplate(formData);
  //   if (!validation.isValid) {
  //     setErrors(validation.errors);
  //     // Go to first step with error
  //     const errorFields = validation.errors.map((e) => e.field);
  //     if (errorFields.includes("name")) setCurrentStep("basics");
  //     else if (errorFields.includes("content")) setCurrentStep("content");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmitError(null);

  //   try {
  //     const request = {
  //       name: formData.name,
  //       type: formData.type,
  //       channel: formData.channel,
  //       content: formData.content,
  //       variables: formData.variables,
  //     };

  //     const response = editingTemplate
  //       ? await templateApi.update({ ...request, id: editingTemplate.id })
  //       : await templateApi.create(request);

  //     if (response.success) {
  //       onSuccess();
  //       onClose();
  //     } else {
  //       setSubmitError(response.error || "Failed to save template");
  //     }
  //   } catch (error) {
  //     setSubmitError("An unexpected error occurred");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }, [formData, editingTemplate, onSuccess, onClose]);

  if (!isOpen) return null;

  const charInfo = getCharacterInfo(formData.content, formData.channel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-rose-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingTemplate ? "Edit Template" : "Create New Template"}
              </h2>
              <p className="text-sm text-white/60">
                Step {STEPS.findIndex((s) => s.id === currentStep) + 1} of{" "}
                {STEPS.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
                    currentStep === step.id
                      ? "bg-rose-500/20 text-rose-400"
                      : "text-white/40 hover:text-white/60 hover:bg-white/5",
                  )}
                >
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      currentStep === step.id
                        ? "bg-rose-500 text-white"
                        : "bg-white/10",
                    )}
                  >
                    {step.number}
                  </span>
                  <span className="text-sm font-medium">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <ChevronDown className="w-4 h-4 text-white/20 rotate-[-90deg] mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basics */}
          {currentStep === "basics" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Template Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="e.g., Pickup Confirmation"
                  className={cn(
                    "w-full h-12 px-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30",
                    "focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50",
                    "transition-all",
                    getFieldError("name")
                      ? "border-red-500"
                      : "border-white/10",
                  )}
                />
                {getFieldError("name") && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              {/* Template Type */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Template Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {TEMPLATE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateFormData("type", type.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                        formData.type === type.value
                          ? type.color + " border-current"
                          : "border-white/10 text-white/60 hover:bg-white/5",
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <button
                        key={channel.value}
                        onClick={() => updateFormData("channel", channel.value)}
                        className={cn(
                          "flex items-center justify-center gap-3 px-4 py-4 rounded-xl border transition-all",
                          formData.channel === channel.value
                            ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                            : "border-white/10 text-white/60 hover:bg-white/5",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">{channel.label}</div>
                          <div className="text-xs opacity-60">
                            {channel.limit} char limit
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === "content" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Quick Insert */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Quick Insert Variables
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "customer_name",
                    "vehicle",
                    "origin",
                    "destination",
                    "eta",
                    "tracking_link",
                    "load_id",
                    "amount",
                  ].map((v) => (
                    <button
                      key={v}
                      onClick={() => insertVariable(v)}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-mono hover:bg-purple-500/30 transition-colors"
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Code className="w-4 h-4 text-rose-400" />
                    Template Content <span className="text-rose-400">*</span>
                  </label>
                  <div
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      charInfo.isOverLimit
                        ? "bg-red-500/20 text-red-400"
                        : charInfo.percentage > 80
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-white/10 text-white/60",
                    )}
                  >
                    {charInfo.count} / {charInfo.limit}
                    {formData.channel === "sms" && charInfo.segments > 1 && (
                      <span className="ml-1">
                        ({charInfo.segments} segments)
                      </span>
                    )}
                  </div>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateFormData("content", e.target.value)}
                  placeholder={`Enter your ${formData.channel.toUpperCase()} message content...\n\nUse {{variable_name}} for dynamic content.`}
                  rows={6}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 font-mono text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50",
                    "transition-all resize-none",
                    getFieldError("content")
                      ? "border-red-500"
                      : "border-white/10",
                  )}
                />
                {getFieldError("content") && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {getFieldError("content")}
                  </p>
                )}

                {/* Character Progress Bar */}
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      charInfo.isOverLimit
                        ? "bg-red-500"
                        : charInfo.percentage > 80
                          ? "bg-amber-500"
                          : "bg-rose-500",
                    )}
                    style={{ width: `${Math.min(charInfo.percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Detected Variables */}
              {formData.variables.length > 0 && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {formData.variables.length} variable
                      {formData.variables.length !== 1 ? "s" : ""} detected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.variables.map((v) => (
                      <code
                        key={v.name}
                        className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-mono"
                      >
                        {`{{${v.name}}}`}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Variables */}
          {currentStep === "variables" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {formData.variables.length === 0 ? (
                <div className="text-center py-12">
                  <Info className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">
                    No variables detected in your template.
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    Add variables using {"{{variable_name}}"} syntax in your
                    content.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white/80">
                      Configure Variables ({formData.variables.length})
                    </h3>
                  </div>

                  {formData.variables.map((variable, index) => (
                    <div
                      key={variable.name}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <code className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg font-mono text-sm">
                          {`{{${variable.name}}}`}
                        </code>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={variable.required}
                            onChange={(e) =>
                              updateVariable(index, {
                                required: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-rose-500 focus:ring-rose-500/50"
                          />
                          <span className="text-white/60">Required</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/50 mb-1">
                            Type
                          </label>
                          <select
                            value={variable.type}
                            onChange={(e) =>
                              updateVariable(index, {
                                type: e.target.value as VariableType,
                              })
                            }
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                          >
                            {VARIABLE_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-white/50 mb-1">
                            Default Value
                          </label>
                          <input
                            type="text"
                            value={variable.defaultValue || ""}
                            onChange={(e) =>
                              updateVariable(index, {
                                defaultValue: e.target.value,
                              })
                            }
                            placeholder="Optional default"
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-white/50 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={variable.description || ""}
                          onChange={(e) =>
                            updateVariable(index, {
                              description: e.target.value,
                            })
                          }
                          placeholder={generateDescription(variable.name)}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === "preview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Preview Card */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-medium text-white/80">
                    Live Preview
                  </h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    {formData.channel === "sms" && (
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                    )}
                    {formData.channel === "email" && (
                      <Mail className="w-4 h-4 text-purple-400" />
                    )}
                    {formData.channel === "push" && (
                      <Bell className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs text-white/50 uppercase">
                      {formData.channel}
                    </span>
                  </div>
                  <p className="text-white leading-relaxed">
                    {renderTemplateWithFormatting(
                      formData.content,
                      previewValues,
                      formData.variables,
                    )}
                  </p>
                </div>
              </div>

              {/* Test Values */}
              {formData.variables.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-3">
                    Test Values
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.variables.map((variable) => (
                      <div key={variable.name}>
                        <label className="block text-xs text-white/50 mb-1">
                          {generateDescription(variable.name)}
                        </label>
                        <input
                          type="text"
                          value={previewValues[variable.name] || ""}
                          onChange={(e) =>
                            setPreviewValues((prev) => ({
                              ...prev,
                              [variable.name]: e.target.value,
                            }))
                          }
                          className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-sm font-medium text-white/80 mb-3">
                  Template Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Name:</span>
                    <span className="ml-2 text-white">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Type:</span>
                    <Badge
                      className={cn(
                        "ml-2",
                        TEMPLATE_TYPES.find((t) => t.value === formData.type)
                          ?.color,
                      )}
                    >
                      {formData.type}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-white/50">Channel:</span>
                    <span className="ml-2 text-white capitalize">
                      {formData.channel}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Variables:</span>
                    <span className="ml-2 text-white">
                      {formData.variables.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Characters:</span>
                    <span
                      className={cn(
                        "ml-2",
                        charInfo.isOverLimit ? "text-red-400" : "text-white",
                      )}
                    >
                      {charInfo.count} / {charInfo.limit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{submitError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <Button
            variant="ghost"
            onClick={currentStep === "basics" ? onClose : handleBack}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            {currentStep === "basics" ? "Cancel" : "Back"}
          </Button>

          <div className="flex gap-3">
            {currentStep !== "preview" ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed(currentStep)}
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={() => {}}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingTemplate ? "Update Template" : "Create Template"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplateModal;
