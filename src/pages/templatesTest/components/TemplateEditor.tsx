import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Code,
  Copy,
  Edit2,
  Eye,
  MessageSquare,
  Play,
  Trash2,
} from "lucide-react";
import { previewReplacements, typeColors } from "../data";
import { Template } from "../types";

interface TemplateEditorProps {
  template: Template | null;
  isEditing: boolean;
  testResult: "success" | "error" | null;
  onToggleEdit: () => void;
  onTestSend: () => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
}

function getPreviewContent(content: string): string {
  let result = content;
  for (const [placeholder, value] of Object.entries(previewReplacements)) {
    result = result.replace(placeholder, value);
  }
  return result;
}

export function TemplateEditor({
  template,
  isEditing,
  testResult,
  onToggleEdit,
  onTestSend,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateEditorProps) {
  if (!template) {
    return (
      <Card variant="glow" className="lg:col-span-2">
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select a template to view and edit</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glow" className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CardTitle>{template.name}</CardTitle>
            {template.isSystem && (
              <Badge variant="secondary">System Template</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                typeColors[template.type],
              )}
            >
              {template.type}
            </span>
            <span>•</span>
            <span className="capitalize">{template.channel}</span>
            <span>•</span>
            <span>{template.usageCount.toLocaleString()} uses</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          {!template.isSystem && (
            <>
              <Button variant="outline" size="sm" onClick={onToggleEdit}>
                <Edit2 className="h-4 w-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Template Content
            </h3>
            <span className="text-xs text-muted-foreground">
              {template.content.length} characters
            </span>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl border font-mono text-sm",
              isEditing
                ? "border-primary bg-secondary"
                : "border-border bg-secondary/30",
            )}
          >
            {isEditing ? (
              <textarea
                defaultValue={template.content}
                className="w-full bg-transparent resize-none focus:outline-none min-h-[100px]"
              />
            ) : (
              <p className="whitespace-pre-wrap">{template.content}</p>
            )}
          </div>
        </div>

        {/* Variables */}
        <div>
          <h3 className="font-semibold mb-3">Available Variables</h3>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((variable) => (
              <code
                key={variable}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-mono cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {"{{" + variable + "}}"}
              </code>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Live Preview
          </h3>
          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <p className="text-sm">{getPreviewContent(template.content)}</p>
          </div>
        </div>

        {/* Test Send */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            Test Send
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={
                template.channel === "sms" ? "+1 555-0123" : "test@example.com"
              }
              className="flex-1 h-10 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={onTestSend}>Send Test</Button>
          </div>
          {testResult && (
            <div
              className={cn(
                "mt-3 p-3 rounded-lg flex items-center gap-2",
                testResult === "success"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {testResult === "success" ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Test message sent successfully!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to send test message. Please try again.</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
