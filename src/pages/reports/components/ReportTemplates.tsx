import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReportTemplate } from '../types';
import { iconMap, typeColors } from '../data';

interface ReportTemplatesProps {
  templates: ReportTemplate[];
  selectedTemplate: ReportTemplate | null;
  onSelectTemplate: (template: ReportTemplate) => void;
}

export function ReportTemplates({
  templates,
  selectedTemplate,
  onSelectTemplate
}: ReportTemplatesProps) {
  return (
    <Card variant="glow" className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Report Templates</CardTitle>
        <p className="text-sm text-muted-foreground">Pre-configured report formats</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template, index) => {
            const Icon = iconMap[template.icon];
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all animate-fade-in hover:border-primary/50",
                  selectedTemplate?.id === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {template.scheduled && (
                    <Badge variant="success">Scheduled</Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={cn("px-2 py-0.5 rounded-full font-medium capitalize", typeColors[template.type])}>
                    {template.type}
                  </span>
                  <span className="text-muted-foreground">{template.lastGenerated}</span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}